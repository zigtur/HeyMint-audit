# Gas Optimization

Mutliple gas optimizations has been made on multiple functions. As the most called functions are user ones, efforts have mainly been concentrated on this part.

## Before optimizations
Default results:
```
·-------------------------------------------------------------------------|---------------------------|--------------|-----------------------------·
|                          Solc version: 0.8.18                           ·  Optimizer enabled: true  ·  Runs: 1000  ·  Block limit: 30000000 gas  │
··········································································|···························|··············|······························
|  Methods                                                                                                                                         │
·····························|············································|·············|·············|··············|···············|··············
|  Contract                  ·  Method                                    ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  addOrUpdateSelectors                      ·     195830  ·     904346  ·      429263  ·           14  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  setFallbackImplAddress                    ·          -  ·          -  ·       46256  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  transferOwnership                         ·          -  ·          -  ·       38783  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  EnumerableERC1155         ·  giftTokens                                ·          -  ·          -  ·       81313  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  EnumerableERC1155         ·  setApprovalForAll                         ·          -  ·          -  ·       46331  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  EnumerableERC721          ·  gift                                      ·   11574122  ·   11576610  ·    11574620  ·            5  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  EnumerableERC721          ·  setApprovalForAll                         ·          -  ·          -  ·       46266  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  ERC1155                   ·  safeBatchTransferFrom                     ·          -  ·          -  ·      108192  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  ERC1155                   ·  safeTransferFrom                          ·          -  ·          -  ·       73440  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA  ·  pause                                     ·          -  ·          -  ·       56034  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA  ·  permanentlyDisableTokenMinting            ·          -  ·          -  ·       56365  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA  ·  setRoyaltyBasisPoints                     ·          -  ·          -  ·       39175  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA  ·  setRoyaltyPayoutAddress                   ·          -  ·          -  ·       56555  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA  ·  unpause                                   ·          -  ·          -  ·       38912  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  freezePayoutAddresses                     ·          -  ·          -  ·       56017  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  mintToken                                 ·     148250  ·     151349  ·      149283  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenMaxSupply                         ·          -  ·          -  ·       41814  ·            6  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenPublicMintsAllowedPerAddress      ·          -  ·          -  ·       39550  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenPublicPrice                       ·      39521  ·      39533  ·       39529  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenPublicSaleEndTime                 ·          -  ·          -  ·       39605  ·            4  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenPublicSaleStartTime               ·          -  ·          -  ·       39608  ·            4  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenPublicSaleState                   ·      39535  ·      39547  ·       39539  ·            6  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  setTokenUsePublicSaleTimes                ·          -  ·          -  ·       39568  ·            4  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  updatePayoutAddressesAndBasisPoints       ·          -  ·          -  ·      156123  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB  ·  withdraw                                  ·      68708  ·      84051  ·       76380  ·            4  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  presaleMint                               ·     158038  ·     161155  ·      159083  ·            6  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setPresaleSignerAddress                   ·          -  ·          -  ·       39522  ·           11  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresaleEndTime                    ·      39658  ·      56758  ·       45358  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresaleMaxSupply                  ·          -  ·          -  ·       41774  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresaleMintsAllowedPerAddress     ·          -  ·          -  ·       39574  ·            5  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresalePrice                      ·          -  ·          -  ·       39524  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresaleStartTime                  ·          -  ·          -  ·       56714  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenPresaleState                      ·      39568  ·      39580  ·       39579  ·           15  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC  ·  setTokenUsePresaleTimes                   ·      39538  ·      56638  ·       45238  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  setGlobalUri                              ·          -  ·          -  ·       46209  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  setTokenIds                               ·          -  ·          -  ·       98455  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  setTokenUri                               ·          -  ·          -  ·       62042  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  updateAdvancedConfig                      ·     167641  ·     190987  ·      175423  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  updateBaseConfig                          ·          -  ·          -  ·       52754  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  updateBurnTokens                          ·      47008  ·     107759  ·      102236  ·           11  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  updateFullConfig                          ·          -  ·          -  ·      198441  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD  ·  upsertToken                               ·      67449  ·      91703  ·       82765  ·           14  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE  ·  creditCardMint                            ·          -  ·          -  ·      156334  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE  ·  freezeAllMetadata                         ·          -  ·          -  ·       55982  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE  ·  freezeTokenMetadata                       ·          -  ·          -  ·      154581  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE  ·  giftTokens                                ·     102975  ·     134215  ·      109735  ·           12  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE  ·  setCreditCardMintAddresses                ·      79641  ·     102367  ·       82888  ·            7  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  burnToMint                                ·          -  ·          -  ·      280001  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  disableSoulbindAdminTransfersPermanently  ·          -  ·          -  ·       56035  ·            3  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  refund                                    ·          -  ·          -  ·       81830  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  setBurnClaimState                         ·      36789  ·      41950  ·       40660  ·            8  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  setRefundAddress                          ·          -  ·          -  ·       56573  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  setSoulbindingState                       ·          -  ·          -  ·       56662  ·            5  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  setSoulboundAdminAddress                  ·          -  ·          -  ·       56680  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  soulboundAdminTransfer                    ·          -  ·          -  ·      100660  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  updateMintsPerBurn                        ·          -  ·          -  ·       56982  ·            7  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF  ·  updatePaymentPerBurn                      ·          -  ·          -  ·       56623  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionG  ·  freeClaim                                 ·     104165  ·     175365  ·      161125  ·            5  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionG  ·  setFreeClaimContractAddress               ·          -  ·          -  ·       56823  ·            8  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionG  ·  setFreeClaimState                         ·          -  ·          -  ·       39820  ·            7  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionG  ·  updateMintsPerFreeClaim                   ·          -  ·          -  ·       39482  ·            7  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  Deployments                                                            ·                                          ·  % of limit   ·             │
··········································································|·············|·············|··············|···············|··············
|  AddressRelay                                                           ·          -  ·          -  ·     1314019  ·        4.4 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  EnumerableERC1155                                                      ·          -  ·          -  ·     4671056  ·       15.6 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  EnumerableERC721                                                       ·          -  ·          -  ·     2198475  ·        7.3 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155Child                                                    ·     542903  ·     679103  ·      678489  ·        2.3 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionA                                               ·          -  ·          -  ·     3187906  ·       10.6 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionB                                               ·          -  ·          -  ·     3347030  ·       11.2 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionC                                               ·          -  ·          -  ·     3214797  ·       10.7 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionD                                               ·          -  ·          -  ·     4899231  ·       16.3 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionE                                               ·          -  ·          -  ·     3028708  ·       10.1 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionF                                               ·          -  ·          -  ·     3640292  ·       12.1 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155ExtensionG                                               ·          -  ·          -  ·     2750592  ·        9.2 %  ·          -  │
··········································································|·············|·············|··············|···············|··············
|  HeyMintERC1155Reference                                                ·          -  ·          -  ·     2168237  ·        7.2 %  ·          -  │
·-------------------------------------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```


## After all optimizations



## Optimization Details

### Modify optimizer options

Optimizer configuration can be modified to reduce gas prices paid by users.

This will make deployed basecode bigger, but more gas efficient during usage. As it is bigger, it will cost more during contract deployment (HeyMint will pay higher fees).

Optimizer "runs" variable was set to `1000`. Setting it to `10000` increases deployment gas price, but reduces usage gas price.

Configuration in `hardhat.config.js`:
```js
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
```

### HeyMintERC1155Child
#### constructor
##### Initial code
- Lines: `32-34`
```solidity
        IAddressRelay addressRelay = IAddressRelay(
            StorageSlot.getAddressSlot(_ADDRESS_RELAY_SLOT).value
        );
```

##### Optimized code
- Explanations: Reading value on-chain (through storage) is not mandatory, as value is known as a local variable.
- Average gas saved: `1330`
```solidity
        IAddressRelay addressRelay = IAddressRelay(
            _addressRelay //Zigtur Gas Optimization: Do not read from storage here
        );
```



### AddressRelay
#### Removing elements
In AddressRelay, elements are deleted from array by setting zero value. But it doesn't reduce array length. As all elements are read when looping through array and cold storage access is expensive, deleting an element using another way could be better.

A way to delete it would be to copy last element to the slot where value should be deleted, and popping out last element. This will reduce array length, and avoid looping through unused elements (set to `zero`). 

On a long-term basis, if there are multiple evolutions, arrays will be very long and gas consuming. This improvement should be implemented for long-term purposes.

:warning: The provided code has been tested in `ZigturAudit.js`, especially the `removeImplAddressAndAllSelectors` function :warning:
##### Initial code
- Lines: `63-103`
- Functions impacted: `removeSelectors`, `removeImplAddressAndAllSelectors`
```solidity
    /**
     * @notice Removes selectors
     * @param _selectors The selectors to remove
     */
    function removeSelectors(bytes4[] memory _selectors) external onlyOwner {
        require(!relayFrozen, "RELAY_FROZEN");
        for (uint256 i = 0; i < _selectors.length; i++) {
            bytes4 selector = _selectors[i];
            delete selectorToImplAddress[selector];
            for (uint256 j = 0; j < selectors.length; j++) {
                if (selectors[j] == selector) {
                    // this just sets the value to 0, but doesn't remove it from the array
                    delete selectors[j];
                    break;
                }
            }
        }
    }

    /**
     * @notice Removes an implementation address and all the selectors that point to it
     * @param _implAddress The implementation address to remove
     */
    function removeImplAddressAndAllSelectors(
        address _implAddress
    ) external onlyOwner {
        require(!relayFrozen, "RELAY_FROZEN");
        for (uint256 i = 0; i < implAddresses.length; i++) {
            if (implAddresses[i] == _implAddress) {
                // this just sets the value to 0, but doesn't remove it from the array
                delete implAddresses[i];
                break;
            }
        }
        for (uint256 i = 0; i < selectors.length; i++) {
            if (selectorToImplAddress[selectors[i]] == _implAddress) {
                delete selectorToImplAddress[selectors[i]];
                delete selectors[i];
            }
        }
    }
```

##### Optimized code
- Explanations:
```solidity
    /**
     * @notice Removes selectors
     * @param _selectors The selectors to remove
     */
    function removeSelectors(bytes4[] memory _selectors) external onlyOwner {
        require(!relayFrozen, "RELAY_FROZEN");
        for (uint256 i = 0; i < _selectors.length; i++) {
            bytes4 selector = _selectors[i];
            delete selectorToImplAddress[selector];
            uint256 selectorsLen = selectors.length;
            for (uint256 j = 0; j < selectorsLen; j++) {
                if (selectors[j] == selector) {
                    if (j != selectorsLen-1) {
                        // if not last element, copy last to deleted element's slot
                        selectors[j] = selectors[selectorsLen-1];
                    }
                    // pop last element
                    selectors.pop();
                    break;
                }
            }
        }
    }

    /**
     * @notice Removes an implementation address and all the selectors that point to it
     * @param _implAddress The implementation address to remove
     */
    function removeImplAddressAndAllSelectors(
        address _implAddress
    ) external onlyOwner {
        require(!relayFrozen, "RELAY_FROZEN");
        uint256 implAddressesLen = implAddresses.length;
        for (uint256 i = 0; i < implAddressesLen; i++) {
            if (implAddresses[i] == _implAddress) {
                    if (i != implAddressesLen-1) {
                        // if not last element, copy last to deleted element's slot
                        implAddresses[i] = implAddresses[implAddressesLen-1];
                    }
                    // pop last element
                    implAddresses.pop();
                    break;
            }
        }
        
        // ZIGTUR: WARNING !!! This code needs to be further tested.
        uint256 selectorsLen = selectors.length;
        for (uint256 i = 0; i < selectorsLen; ) {
            bytes4 selector = selectors[i];
            if (selectorToImplAddress[selector] == _implAddress) {
                delete selectorToImplAddress[selector];
                if (i != selectorsLen-1) {
                        // if not last element, copy last to deleted element's slot
                        selectors[i] = selectors[selectorsLen-1];
                        unchecked{i--;} // reduce i, as last element has been copied and needs to be checked. unchecked because if i==0, then underflow (unchecked i++ at the end will solve that)
                        selectorsLen--;
                    }
                    // pop last element
                    selectors.pop();
            }
            unchecked{ i++; }
        }
    }
```

### HeyMintERC1155ExtensionB
#### mintToken
##### Initial code
- Lines: `100-154`
```solidity
    /**
     * @notice Allow for public minting of tokens for a given token
     */
    function mintToken(
        uint16 _tokenId,
        uint16 _numTokens
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint16 totalSupply = state.data.totalSupply[_tokenId];
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        uint256 publicPrice = publicPriceInWei(_tokenId);
        require(
            state.tokens[_tokenId].publicSaleActive,
            "PUBLIC_SALE_IS_NOT_ACTIVE"
        );
        require(
            tokenPublicSaleTimeIsActive(_tokenId),
            "PUBLIC_SALE_TIME_IS_NOT_ACTIVE"
        );
        require(
            state.tokens[_tokenId].publicMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[msg.sender][_tokenId] +
                    _numTokens <=
                state.tokens[_tokenId].publicMintsAllowedPerAddress,
            "MAX_MINTS_FOR_ADDRESS_EXCEEDED"
        );
        require(
            state.tokens[_tokenId].maxSupply == 0 ||
                totalSupply + _numTokens <= state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            msg.value == publicPrice * _numTokens + heymintFee,
            "PAYMENT_INCORRECT"
        );
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }
        state.data.totalSupply[_tokenId] += _numTokens;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += _numTokens;

        _mint(msg.sender, _tokenId, _numTokens, "");

        if (
            state.tokens[_tokenId].maxSupply != 0 &&
            state.data.totalSupply[_tokenId] >= state.tokens[_tokenId].maxSupply
        ) {
            state.tokens[_tokenId].publicSaleActive = false;
        }
    }
```

##### Optimized code
- Explanations: Reading storage is expensive, reduce the number of reads.
- Average gas saved: `1230`
```solidity
    /**
     * @notice Allow for public minting of tokens for a given token
     */
    function mintToken(
        uint16 _tokenId,
        uint16 _numTokens
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint16 totalSupply = state.data.totalSupply[_tokenId];
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        uint256 publicPrice = publicPriceInWei(_tokenId);
        require(
            state.tokens[_tokenId].publicSaleActive,
            "PUBLIC_SALE_IS_NOT_ACTIVE"
        );
        require(
            tokenPublicSaleTimeIsActive(_tokenId),
            "PUBLIC_SALE_TIME_IS_NOT_ACTIVE"
        );
        uint16 newTokensMintedByAddress = state.data.tokensMintedByAddress[msg.sender][_tokenId] + _numTokens;
        uint16 publicMintsAllowedPerAddress = state.tokens[_tokenId].publicMintsAllowedPerAddress;
        require(
            publicMintsAllowedPerAddress == 0 ||
                newTokensMintedByAddress <=
                publicMintsAllowedPerAddress,
            "MAX_MINTS_FOR_ADDRESS_EXCEEDED"
        );
        uint16 newTotalSupply = totalSupply + _numTokens;
        uint16 _maxSupply = state.tokens[_tokenId].maxSupply;
        require(
            _maxSupply == 0 ||
                newTotalSupply <= state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            msg.value == publicPrice * _numTokens + heymintFee,
            "PAYMENT_INCORRECT"
        );
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }
        state.data.totalSupply[_tokenId] = newTotalSupply;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] = newTokensMintedByAddress;

        _mint(msg.sender, _tokenId, _numTokens, "");

        if (
            _maxSupply != 0 &&
            newTotalSupply == _maxSupply
        ) {
            state.tokens[_tokenId].publicSaleActive = false;
        }
    }
```




### HeyMintERC1155ExtensionC
#### presaleMint
##### Initial code
- Lines: `143-224`
```solidity
    /**
     * @notice Allow for allowlist minting of tokens
     */
    function presaleMint(
        bytes32 _messageHash,
        bytes calldata _signature,
        uint16 _tokenId,
        uint16 _numTokens,
        uint256 _maximumAllowedMints
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        TokenConfig storage tokenConfig = state.tokens[_tokenId];
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        uint256 presalePrice = presalePriceInWei(_tokenId);

        require(tokenConfig.presaleActive, "PRESALE_IS_NOT_ACTIVE");
        require(
            tokenPresaleTimeIsActive(_tokenId),
            "PRESALE_TIME_IS_NOT_ACTIVE"
        );
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        require(
            tokenConfig.presaleMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[msg.sender][_tokenId] +
                    _numTokens <=
                tokenConfig.presaleMintsAllowedPerAddress,
            "MAX_MINTS_PER_ADDRESS_EXCEEDED"
        );
        require(
            _maximumAllowedMints == 0 ||
                state.data.tokensMintedByAddress[msg.sender][_tokenId] +
                    _numTokens <=
                _maximumAllowedMints,
            "MAX_MINTS_EXCEEDED"
        );
        require(
            state.tokens[_tokenId].maxSupply == 0 ||
                state.data.totalSupply[_tokenId] + _numTokens <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            tokenConfig.presaleMaxSupply == 0 ||
                state.data.totalSupply[_tokenId] + _numTokens <=
                tokenConfig.presaleMaxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            msg.value == presalePrice * _numTokens + heymintFee,
            "PAYMENT_INCORRECT"
        );
        require(
            keccak256(abi.encode(msg.sender, _maximumAllowedMints, _tokenId)) ==
                _messageHash,
            "MESSAGE_INVALID"
        );
        require(
            verifySignerAddress(_messageHash, _signature),
            "SIGNATURE_VALIDATION_FAILED"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }

        state.data.tokensMintedByAddress[msg.sender][_tokenId] += _numTokens;
        state.data.totalSupply[_tokenId] += _numTokens;

        _mint(msg.sender, _tokenId, _numTokens, "");

        if (
            state.tokens[_tokenId].presaleMaxSupply != 0 &&
            state.data.totalSupply[_tokenId] >=
            state.tokens[_tokenId].presaleMaxSupply
        ) {
            state.tokens[_tokenId].presaleActive = false;
        }
    }
```

##### Optimized code
- Explanations: Reading storage is expensive, reduce the number of reads. A check has been modified to be `==` instead of `>=`.
- Average gas saved: `1769`
```solidity
    /**
     * @notice Allow for allowlist minting of tokens
     */
    function presaleMint(
        bytes32 _messageHash,
        bytes calldata _signature,
        uint16 _tokenId,
        uint16 _numTokens,
        uint256 _maximumAllowedMints
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        TokenConfig storage tokenConfig = state.tokens[_tokenId];
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        uint256 presalePrice = presalePriceInWei(_tokenId);

        require(tokenConfig.presaleActive, "PRESALE_IS_NOT_ACTIVE");
        require(
            tokenPresaleTimeIsActive(_tokenId),
            "PRESALE_TIME_IS_NOT_ACTIVE"
        );
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        uint16 presaleMintsAllowedPerAddress = tokenConfig.presaleMintsAllowedPerAddress;
        uint16 newTokensMintedByAddress = state.data.tokensMintedByAddress[msg.sender][_tokenId] + _numTokens;
        require(
            presaleMintsAllowedPerAddress == 0 ||
                newTokensMintedByAddress <=
                presaleMintsAllowedPerAddress,
            "MAX_MINTS_PER_ADDRESS_EXCEEDED"
        );
        require(
            _maximumAllowedMints == 0 ||
                newTokensMintedByAddress <=
                _maximumAllowedMints,
            "MAX_MINTS_EXCEEDED"
        );
        uint16 newTotalSupply = state.data.totalSupply[_tokenId] + _numTokens;
        require(
            state.tokens[_tokenId].maxSupply == 0 ||
                newTotalSupply <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint16 presaleMaxSupply = tokenConfig.presaleMaxSupply;
        require(
            presaleMaxSupply == 0 ||
                newTotalSupply <=
                presaleMaxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            msg.value == presalePrice * _numTokens + heymintFee,
            "PAYMENT_INCORRECT"
        );
        require(
            keccak256(abi.encode(msg.sender, _maximumAllowedMints, _tokenId)) ==
                _messageHash,
            "MESSAGE_INVALID"
        );
        require(
            verifySignerAddress(_messageHash, _signature),
            "SIGNATURE_VALIDATION_FAILED"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }

        state.data.tokensMintedByAddress[msg.sender][_tokenId] = newTokensMintedByAddress;
        state.data.totalSupply[_tokenId] = newTotalSupply;

        _mint(msg.sender, _tokenId, _numTokens, "");

        if (
            presaleMaxSupply != 0 &&
            newTotalSupply ==
            presaleMaxSupply
        ) {
            state.tokens[_tokenId].presaleActive = false;
        }
    }
```


### HeyMintERC1155ExtensionE
#### giftTokens
##### Initial code
- Lines: `35-73`
```solidity
    /**
     * @notice Allow owner to send tokens without cost to multiple addresses
     */
    function giftTokens(
        uint16 _tokenId,
        address[] calldata _receivers,
        uint256[] calldata _mintNumber
    ) external payable onlyOwner {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        require(
            _receivers.length == _mintNumber.length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        uint256 totalMints = 0;
        for (uint256 i = 0; i < _mintNumber.length; i++) {
            totalMints += _mintNumber[i];
        }
        // require either no tokenMaxSupply set or tokenMaxSupply not maxed out
        require(
            state.tokens[_tokenId].maxSupply == 0 ||
                state.data.totalSupply[_tokenId] + totalMints <=
                state.tokens[_tokenId].maxSupply,
            "MINT_TOO_LARGE"
        );
        uint256 heymintFee = (totalMints * heymintFeePerToken()) / 10;
        require(msg.value == heymintFee, "PAYMENT_INCORRECT");
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }
        state.data.totalSupply[_tokenId] += uint16(totalMints);
        for (uint256 i = 0; i < _receivers.length; i++) {
            _mint(_receivers[i], _tokenId, _mintNumber[i], "");
        }
    }
```

##### Optimized code
- Explanations: Reading storage is expensive, reduce the number of reads.
- Average gas saved: `382`
```solidity
    /**
     * @notice Allow owner to send tokens without cost to multiple addresses
     */
    function giftTokens(
        uint16 _tokenId,
        address[] calldata _receivers,
        uint256[] calldata _mintNumber
    ) external payable onlyOwner {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        require(
            !state.data.tokenMintingPermanentlyDisabled[_tokenId],
            "MINTING_PERMANENTLY_DISABLED"
        );
        require(
            _receivers.length == _mintNumber.length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        uint256 totalMints = 0;
        for (uint256 i = 0; i < _mintNumber.length; i++) {
            totalMints += _mintNumber[i];
        }
        // require either no tokenMaxSupply set or tokenMaxSupply not maxed out
        uint16 newtotalSupply = state.data.totalSupply[_tokenId] + uint16(totalMints);
        uint16 maxSupply = state.tokens[_tokenId].maxSupply;
        require(
            maxSupply == 0 ||
                newtotalSupply <=
                maxSupply,
            "MINT_TOO_LARGE"
        );
        uint256 heymintFee = (totalMints * heymintFeePerToken()) / 10;
        require(msg.value == heymintFee, "PAYMENT_INCORRECT");
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "HeyMint fee transfer failed");
        }
        state.data.totalSupply[_tokenId] = newtotalSupply;
        for (uint256 i = 0; i < _receivers.length; i++) {
            _mint(_receivers[i], _tokenId, _mintNumber[i], "");
        }
    }
```

#### creditCardMint
##### Initial code
- Lines: `107-169`
```solidity
    function creditCardMint(
        uint16 _tokenId,
        uint16 _numTokens,
        address _to
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        address[5]
            memory defaultAddresses = getDefaultCreditCardMintAddresses();
        bool authorized = false;
        for (uint256 i = 0; i < defaultAddresses.length; i++) {
            if (msg.sender == defaultAddresses[i]) {
                authorized = true;
                break;
            }
        }
        if (!authorized) {
            for (
                uint256 i = 0;
                i < state.advCfg.creditCardMintAddresses.length;
                i++
            ) {
                if (msg.sender == state.advCfg.creditCardMintAddresses[i]) {
                    authorized = true;
                    break;
                }
            }
        }
        require(authorized, "NOT_AUTHORIZED_ADDRESS");
        require(state.tokens[_tokenId].publicSaleActive, "NOT_ACTIVE");
        require(tokenPublicSaleTimeIsActive(_tokenId), "NOT_ACTIVE");
        require(
            state.tokens[_tokenId].publicMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[_to][_tokenId] + _numTokens <=
                state.tokens[_tokenId].publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        require(
            state.data.totalSupply[_tokenId] + _numTokens <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 publicPrice = publicPriceInWei(_tokenId);
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        require(
            msg.value == publicPrice * _numTokens + heymintFee,
            "INVALID_PRICE_PAID"
        );
        if (heymintFee > 0) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }

        state.data.totalSupply[_tokenId] += _numTokens;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += _numTokens;
        _mint(_to, _tokenId, _numTokens, "");

        if (
            state.tokens[_tokenId].presaleMaxSupply != 0 &&
            state.data.totalSupply[_tokenId] >= state.tokens[_tokenId].maxSupply
        ) {
            state.tokens[_tokenId].publicSaleActive = false;
        }
    }
```

##### Optimized code
:warning: A check has been fixed here. `presaleMaxSupply` was checked instead of `maxSupply`. :warning:
- Explanations: Reading storage is expensive, reduce the number of reads.
- Average gas saved: `1222`
```solidity
    function creditCardMint(
        uint16 _tokenId,
        uint16 _numTokens,
        address _to
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        address[5]
            memory defaultAddresses = getDefaultCreditCardMintAddresses();
        bool authorized = false;
        for (uint256 i = 0; i < defaultAddresses.length; i++) {
            if (msg.sender == defaultAddresses[i]) {
                authorized = true;
                break;
            }
        }
        if (!authorized) {
            for (
                uint256 i = 0;
                i < state.advCfg.creditCardMintAddresses.length;
                i++
            ) {
                if (msg.sender == state.advCfg.creditCardMintAddresses[i]) {
                    authorized = true;
                    break;
                }
            }
        }
        require(authorized, "NOT_AUTHORIZED_ADDRESS");
        require(state.tokens[_tokenId].publicSaleActive, "NOT_ACTIVE");
        require(tokenPublicSaleTimeIsActive(_tokenId), "NOT_ACTIVE");
        uint16 publicMintsAllowedPerAddress = state.tokens[_tokenId].publicMintsAllowedPerAddress;
        uint16 newTokensMintedByAddress = state.data.tokensMintedByAddress[_to][_tokenId] + _numTokens;
        require(
            publicMintsAllowedPerAddress == 0 ||
                newTokensMintedByAddress <=
                publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        uint16 newTotalSupply = state.data.totalSupply[_tokenId] + _numTokens;
        uint16 maxSupply = state.tokens[_tokenId].maxSupply;
        require(
            newTotalSupply <=
                maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 publicPrice = publicPriceInWei(_tokenId);
        uint256 heymintFee = _numTokens * heymintFeePerToken();
        require(
            msg.value == publicPrice * _numTokens + heymintFee,
            "INVALID_PRICE_PAID"
        );
        if (heymintFee > 0) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }

        state.data.totalSupply[_tokenId] = newTotalSupply;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] = newTokensMintedByAddress;
        _mint(_to, _tokenId, _numTokens, "");

        if (
            maxSupply != 0 &&
            newTotalSupply == maxSupply
        ) {
            state.tokens[_tokenId].publicSaleActive = false;
        }
    }
```


### HeyMintERC1155ExtensionF
#### burnToMint
##### Initial code
- Lines: `232-319`
```solidity
    function burnToMint(
        uint16 _tokenId,
        address[] calldata _contracts,
        uint256[][] calldata _tokenIdsToBurn,
        uint16 _tokensToMint
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        require(state.burnTokens[_tokenId].length > 0, "NOT_CONFIGURED");
        require(state.tokens[_tokenId].mintsPerBurn != 0, "NOT_CONFIGURED");
        require(state.tokens[_tokenId].burnClaimActive, "NOT_ACTIVE");
        require(
            _contracts.length == _tokenIdsToBurn.length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        require(
            _contracts.length == state.burnTokens[_tokenId].length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        require(
            state.data.totalSupply[_tokenId] + _tokensToMint <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 burnPayment = burnPaymentInWei(_tokenId);
        uint256 burnPaymentTotal = burnPayment *
            (_tokensToMint / state.tokens[_tokenId].mintsPerBurn);
        uint256 heymintFee = _tokensToMint * heymintFeePerToken();
        require(
            msg.value == burnPaymentTotal + heymintFee,
            "INVALID_PRICE_PAID"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }
        for (uint256 i = 0; i < state.burnTokens[_tokenId].length; i++) {
            BurnToken memory burnToken = state.burnTokens[_tokenId][i];
            require(
                burnToken.contractAddress == _contracts[i],
                "INCORRECT_CONTRACT"
            );
            if (burnToken.tokenType == 1) {
                uint256 _tokenIdsToBurnLength = _tokenIdsToBurn[i].length;
                require(
                    (_tokenIdsToBurnLength / burnToken.tokensPerBurn) *
                        state.tokens[_tokenId].mintsPerBurn ==
                        _tokensToMint,
                    "INCORRECT_NO_OF_TOKENS_TO_BURN"
                );
                for (uint256 j = 0; j < _tokenIdsToBurnLength; j++) {
                    IERC721 burnContract = IERC721(_contracts[i]);
                    uint256 tokenId = _tokenIdsToBurn[i][j];
                    require(
                        burnContract.ownerOf(tokenId) == msg.sender,
                        "MUST_OWN_TOKEN"
                    );
                    burnContract.transferFrom(msg.sender, burnAddress, tokenId);
                }
            } else if (burnToken.tokenType == 2) {
                uint256 amountToBurn = _tokenIdsToBurn[i][0];
                require(
                    (amountToBurn / burnToken.tokensPerBurn) *
                        state.tokens[_tokenId].mintsPerBurn ==
                        _tokensToMint,
                    "INCORRECT_NO_OF_TOKENS_TO_BURN"
                );
                IERC1155 burnContract = IERC1155(_contracts[i]);
                require(
                    burnContract.balanceOf(msg.sender, burnToken.tokenId) >=
                        amountToBurn,
                    "MUST_OWN_TOKEN"
                );
                burnContract.safeTransferFrom(
                    msg.sender,
                    burnAddress,
                    burnToken.tokenId,
                    amountToBurn,
                    ""
                );
            }
        }

        state.data.totalSupply[_tokenId] += _tokensToMint;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += uint16(
            _tokensToMint
        );
        _mint(msg.sender, _tokenId, _tokensToMint, "");
    }
```

##### Optimized code
- Explanations: Reading storage is expensive, reduce the number of reads.
- Average gas saved: `1342`

```solidity
    function burnToMint(
        uint16 _tokenId,
        address[] calldata _contracts,
        uint256[][] calldata _tokenIdsToBurn,
        uint16 _tokensToMint
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint256 burnTokensLen = state.burnTokens[_tokenId].length;
        require(burnTokensLen > 0, "NOT_CONFIGURED");
        uint16 mintsPerBurn = state.tokens[_tokenId].mintsPerBurn;
        require(mintsPerBurn != 0, "NOT_CONFIGURED");
        require(state.tokens[_tokenId].burnClaimActive, "NOT_ACTIVE");
        require(
            _contracts.length == _tokenIdsToBurn.length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        require(
            _contracts.length == burnTokensLen,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        //uint16 newTotalSupply = state.data.totalSupply[_tokenId] + _tokensToMint;
        require(
            state.data.totalSupply[_tokenId] + _tokensToMint <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 burnPayment = burnPaymentInWei(_tokenId);
        uint256 burnPaymentTotal = burnPayment *
            (_tokensToMint / mintsPerBurn);
        uint256 heymintFee = _tokensToMint * heymintFeePerToken();
        require(
            msg.value == burnPaymentTotal + heymintFee,
            "INVALID_PRICE_PAID"
        );
        if (state.cfg.heyMintFeeActive) {
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }
        for (uint256 i = 0; i < burnTokensLen; i++) {
            BurnToken memory burnToken = state.burnTokens[_tokenId][i];
            require(
                burnToken.contractAddress == _contracts[i],
                "INCORRECT_CONTRACT"
            );
            if (burnToken.tokenType == 1) {
                uint256 _tokenIdsToBurnLength = _tokenIdsToBurn[i].length;
                require(
                    (_tokenIdsToBurnLength / burnToken.tokensPerBurn) *
                        mintsPerBurn ==
                        _tokensToMint,
                    "INCORRECT_NO_OF_TOKENS_TO_BURN"
                );
                for (uint256 j = 0; j < _tokenIdsToBurnLength; j++) {
                    IERC721 burnContract = IERC721(_contracts[i]);
                    uint256 tokenId = _tokenIdsToBurn[i][j];
                    require(
                        burnContract.ownerOf(tokenId) == msg.sender,
                        "MUST_OWN_TOKEN"
                    );
                    burnContract.transferFrom(msg.sender, burnAddress, tokenId);
                }
            } else if (burnToken.tokenType == 2) {
                uint256 amountToBurn = _tokenIdsToBurn[i][0];
                require(
                    (amountToBurn / burnToken.tokensPerBurn) *
                        mintsPerBurn ==
                        _tokensToMint,
                    "INCORRECT_NO_OF_TOKENS_TO_BURN"
                );
                IERC1155 burnContract = IERC1155(_contracts[i]);
                require(
                    burnContract.balanceOf(msg.sender, burnToken.tokenId) >=
                        amountToBurn,
                    "MUST_OWN_TOKEN"
                );
                burnContract.safeTransferFrom(
                    msg.sender,
                    burnAddress,
                    burnToken.tokenId,
                    amountToBurn,
                    ""
                );
            }
        }

        state.data.totalSupply[_tokenId] += _tokensToMint;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += uint16(
            _tokensToMint
        );
        _mint(msg.sender, _tokenId, _tokensToMint, "");
    }
```


### HeyMintERC1155ExtensionG
#### freeClaim
##### Initial code
- Lines: `85-134`
```solidity
    function freeClaim(
        uint16 _tokenId,
        uint256[] calldata _claimTokenIds
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint256 tokenIdsLength = _claimTokenIds.length;
        uint256 totalMints = tokenIdsLength *
            state.tokens[_tokenId].mintsPerFreeClaim;
        require(
            state.tokens[_tokenId].freeClaimContractAddress != address(0),
            "NOT_CONFIGURED"
        );
        require(
            state.tokens[_tokenId].mintsPerFreeClaim != 0,
            "NOT_CONFIGURED"
        );
        require(state.tokens[_tokenId].freeClaimActive, "NOT_ACTIVE");
        require(
            state.data.totalSupply[_tokenId] + totalMints <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        if (state.cfg.heyMintFeeActive) {
            uint256 heymintFee = totalMints * heymintFeePerToken();
            require(msg.value == heymintFee, "PAYMENT_INCORRECT");
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }
        IERC721 ExternalERC721FreeClaimContract = IERC721(
            state.tokens[_tokenId].freeClaimContractAddress
        );
        for (uint256 i = 0; i < tokenIdsLength; i++) {
            require(
                ExternalERC721FreeClaimContract.ownerOf(_claimTokenIds[i]) ==
                    msg.sender,
                "MUST_OWN_TOKEN"
            );
            require(
                !state.data.tokenFreeClaimUsed[_tokenId][_claimTokenIds[i]],
                "TOKEN_ALREADY_CLAIMED"
            );
            state.data.tokenFreeClaimUsed[_tokenId][_claimTokenIds[i]] = true;
        }

        state.data.totalSupply[_tokenId] += uint16(totalMints);
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += uint16(
            totalMints
        );
        _mint(msg.sender, _tokenId, totalMints, "");
    }
```

##### Optimized code
- Explanations: Reading storage is expensive, reduce the number of reads.
- Average gas saved: `639`

```solidity
    function freeClaim(
        uint16 _tokenId,
        uint256[] calldata _claimTokenIds
    ) external payable nonReentrant notPaused {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint16 mintsPerFreeClaim = state.tokens[_tokenId].mintsPerFreeClaim;
        uint256 tokenIdsLength = _claimTokenIds.length;
        uint256 totalMints = tokenIdsLength *
            mintsPerFreeClaim;
        address freeClaimContractAddress = state.tokens[_tokenId].freeClaimContractAddress;
        require(
            state.tokens[_tokenId].freeClaimContractAddress != address(0),
            "NOT_CONFIGURED"
        );
        require(
            mintsPerFreeClaim != 0,
            "NOT_CONFIGURED"
        );
        require(state.tokens[_tokenId].freeClaimActive, "NOT_ACTIVE");
        uint16 newTotalSupply = state.data.totalSupply[_tokenId] + uint16(totalMints);
        require(
            newTotalSupply <=
                state.tokens[_tokenId].maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        if (state.cfg.heyMintFeeActive) {
            uint256 heymintFee = totalMints * heymintFeePerToken();
            require(msg.value == heymintFee, "PAYMENT_INCORRECT");
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }
        IERC721 ExternalERC721FreeClaimContract = IERC721(
            freeClaimContractAddress
        );
        for (uint256 i = 0; i < tokenIdsLength; i++) {
            require(
                ExternalERC721FreeClaimContract.ownerOf(_claimTokenIds[i]) ==
                    msg.sender,
                "MUST_OWN_TOKEN"
            );
            require(
                !state.data.tokenFreeClaimUsed[_tokenId][_claimTokenIds[i]],
                "TOKEN_ALREADY_CLAIMED"
            );
            state.data.tokenFreeClaimUsed[_tokenId][_claimTokenIds[i]] = true;
        }

        state.data.totalSupply[_tokenId] = newTotalSupply;
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += uint16(
            totalMints
        );
        _mint(msg.sender, _tokenId, totalMints, "");
    }
```