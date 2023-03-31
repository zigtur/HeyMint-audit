# HeyMintERC721AChild.sol


## Constructor
Here, I will try to explain the bug in the constructor.

:warning: YOU SHOULD REALLY BE CAREFUL WITH DELEGATECALL :warning:

### Step 1 - Contract storage
First, at the beginning of the contract, you define two variables that are constant:
- _IMPLEMENTATION_SLOT
- _ADDRESS_RELAY_SLOT

Constant variables will be replaced with real value at compilation, nothing will be stored in contract storage (For more info: see https://ethereum.stackexchange.com/questions/140628/where-are-the-smart-contract-constants-stored#:~:text=Constants%20in%20Solidity%20are%20not,sent%20to%20the%20Ethereum%20blockchain.)

So, contract storage will be 0 at index **0**. (This will be used later in the explanation!)

#### Step 1 - Test preparation
For the explanation, the two variables are defined like this:
```
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 internal _ADDRESS_RELAY_SLOT = keccak256("addressRelay");
```

*Note: _ADDRESS_RELAY_SLOT is not defined as a constant*

Once deployed, we can read storage from contract:
```
Slot 0 :  0x9510a957257194aa443e30455db15cf6c788871ef8c8c59de5fbdc1e936fff4c  (which is keccak256("addressRelay"))
Slot 1 :  0x0000000000000000000000000000000000000000000000000000000000000000
Slot 2 :  0x0000000000000000000000000000000000000000000000000000000000000000
Slot 3 :  0x0000000000000000000000000000000000000000000000000000000000000000
Slot 4 :  0x0000000000000000000000000000000000000000000000000000000000000000
Slot 5 :  0x0000000000000000000000000000000000000000000000000000000000000000
Slot 6 :  0x0000000000000000000000000000000000000000000000000000000000000000
```

If _ADDRESS_RELAY_SLOT was defined as constant, storage slot 0 would have value 0. (**NOTE THIS, IT WILL BE USED LATER**).

### Step 2 - Calling delegate call


Then, the `initialize` function from the `HeyMintERC721ABase` contract, using DelegateCall.

#### DelegateCall explanation
The delegateCall does use a foreign contract function code, with the current contract storage. **THAT IS IMPORTANT TO UNDERSTAND THE ISSUE**

As the following link explains, storage layout must be the same between the two contracts: https://solidity-by-example.org/delegatecall/

So, the `initialize` function from the `HeyMintERC721ABase` contract is called, with the storage defined in Step 1 - Test preparation.


### Step3 - __Ownable_init
In the `initialize` function, the `__Ownable_init` function is called. This function does call the `onlyInitializing` modifier from the `Initializable` abstract contract. By looking at the `Initializable` contract, we can see some storage variables that are not set in our `HeyMintERC721AChild` contract. Those variables fit in 1 slot. Here are the variables:
```
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;
```

The `onlyInitializing` variable will check that the bool storage value `_initializing` is set. 



### Proof and Debug

To find the issue, I used console.log from hardhat. This allows to console.log inside smart contracts. 

As defined in Step 1 - Test preparation, the index 0 storage has value:
```
Slot 0 :  0x9510a957257194aa443e30455db15cf6c788871ef8c8c59de5fbdc1e936fff4c
```

#### initialize function from HeyMintERC721ABase contract
I do import console.log in HeyMintERC721ABase contract and do log before each other function call.

```
import "hardhat/console.sol";

/* ZIGTUR: HIDDEN CODE FOR READABILITY PURPOSES */

    function initialize(
        string memory _name,
        string memory _symbol,
        BaseConfig memory _config
    ) public initializerERC721A {
        console.log("Calling __ERC721A_init");
        __ERC721A_init(_name, _symbol);

        console.log("Calling __Ownable_init");
        __Ownable_init();

        console.log("Calling __ReentrancyGuard_init");
        __ReentrancyGuard_init();

        console.log("Calling __OperatorFilterer_init");
        __OperatorFilterer_init(
            _config.enforceRoyalties == true
                ? CORI_SUBSCRIPTION_ADDRESS
                : EMPTY_SUBSCRIPTION_ADDRESS,
            true
        );

    // ZIGTUR: THEN NORMAL CODE
```

#### __Ownable_init function from OwnableUpgradeable contract
Here, I try to log owner, but a modifier is called before.

```
import "hardhat/console.sol";

    /* ZIGTUR: HIDDEN CODE FOR READABILITY PURPOSES */

    function __Ownable_init() internal onlyInitializing {
        console.log(_owner);
        __Ownable_init_unchained();
    }

    /* ZIGTUR: HIDDEN CODE FOR READABILITY PURPOSES */
```


#### onlyInitializing modifier from Initializable contract
I modified the `onlyInitializing` modifier from `Initializable` contract:
```

pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "../../utils/AddressUpgradeable.sol";

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /* ZIGTUR: HIDDEN CODE FOR READABILITY PURPOSES */

    modifier onlyInitializing() {
        console.log("initialized: %s", _initialized);
        console.log("isInitializing: %s", _initializing);
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /* ZIGTUR: HIDDEN CODE FOR READABILITY PURPOSES */

}
```

##### Test result
Now, I do start `npx hardhat run scripts/deploy.js`. Here are the results:
```
deploying child contract
Calling __ERC721A_init
Calling __Ownable_init
initialized: 76
isInitializing: true
```

We can see that initialized = 76. It looks like a random value, right? Now get this into its hexadecimal form and its `4C`. Now, look at the last byte of the storage slot 0 value: `4C`. 

Then, if you look at initialized value: `true`. Now, look at value right after `4C`, the bit value is 1, so it is true. And the contract does deploy.

### Final explanation
So, as we have seen in the last part, some delegateCall code try to read storage value. If we set _ADDRESS_RELAY_SLOT as constant, then storage slot 0 will not have any value.

When the `onlyInitializing` modifier will be called, it will read `_initializing` boolean value, which will be 0 (false) as storage slot 0 has no value.

And so, it will always revert.

### Conclusion
**delegatecall** must be used carefully. Storage layout must be the same in both contract, to avoid some not controled behaviour.

This Solidity-by-example does explain delegatecall: https://solidity-by-example.org/delegatecall/. 
