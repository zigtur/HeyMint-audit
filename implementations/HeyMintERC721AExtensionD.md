# HeyMintERC721AExtensionD.sol

## burnDepositTokensToMint


### Gas Optimization
There are multiple on-chain reading of the `state.advCfg.depositMerkleRoot`. We can reduce it to only 1, because it does not change.
See README Summary - On-chain read to get an explanation of the optimization.

#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method                   |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|---------------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionD  |  burnDepositTokensToMint  |     -  |     -  |   180607 |        2 |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                   |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|---------------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionD  |  burnDepositTokensToMint  |     -  |     -  |   180607 |        2 |


#### Conclusion
Here, we save an amount of gas which depends on the `_tokenIds` array length. The more `_tokenIds` we do pass, the more gas optimization is efficient.

Taking `n = _tokenIds.length`, there was `n` on-chain read of the `state.advCfg.depositMerkleRoot` variable. Now, there is only one.


#### Code

```solidity
    /**
     * @notice Allows for burning deposit tokens in order to mint. The tokens must be eligible for burning.
     * Additional payment may be required in addition to burning the deposit tokens.
     * @dev This contract must be approved by the caller to transfer the deposit tokens being burned
     * @param _tokenIds The token ids of the deposit tokens to burn
     * @param _merkleProofs The merkle proofs for each token id verifying eligibility
     */
    function burnDepositTokensToMint(
        uint256[] calldata _tokenIds,
        bytes32[][] calldata _merkleProofs
    ) external payable nonReentrant {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        require(state.advCfg.depositMerkleRoot != bytes32(0), "NOT_CONFIGURED");
        // Gas Optimization
        address _depositContractAddress = state.advCfg.depositContractAddress;
        require(
            _depositContractAddress != address(0),
            "NOT_CONFIGURED"
        );
        require(state.advCfg.depositClaimActive, "NOT_ACTIVE");
        uint256 numberOfTokens = _tokenIds.length;
        require(numberOfTokens > 0, "NO_TOKEN_IDS_PROVIDED");
        require(
            numberOfTokens == _merkleProofs.length,
            "ARRAY_LENGTHS_MUST_MATCH"
        );
        require(
            totalSupply() + numberOfTokens <= state.cfg.maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            msg.value == remainingDepositPaymentInWei() * numberOfTokens,
            "INCORRECT_REMAINING_PAYMENT"
        );
        IERC721 DepositContract = IERC721(_depositContractAddress);
        // Gas Optimization
        bytes32 _depositMerkleRoot = state.advCfg.depositMerkleRoot;
        for (uint256 i = 0; i < numberOfTokens; i++) {
            require(
                MerkleProofUpgradeable.verify(
                    _merkleProofs[i],
                    _depositMerkleRoot,
                    keccak256(abi.encodePacked(_tokenIds[i]))
                ),
                "INVALID_MERKLE_PROOF"
            );
            require(
                DepositContract.ownerOf(_tokenIds[i]) == msg.sender,
                "MUST_OWN_TOKEN"
            );
            DepositContract.transferFrom(msg.sender, burnAddress, _tokenIds[i]);
        }
        _safeMint(msg.sender, numberOfTokens);
    }
```


## burnToRefund


### Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.

#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method        |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|----------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionD  |  burnToRefund  |     -  |     -  |   98528 |        2 |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method        |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|----------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionD  |  burnToRefund  |     -  |     -  |   98191 |        2 |


#### Conclusion
More gas saved, 330 here for only one token as argument. More gas will be saved if multiple tokens are used in the `_tokenIds` array argument.


#### Code

```solidity
    /**
     * @notice Burn tokens and return the price paid to the token owner if the funding target was not reached
     * Can be called starting 1 day after fundingDuration ends
     * @param _tokenIds The ids of the tokens to be refunded
     */
    function burnToRefund(uint256[] calldata _tokenIds) external nonReentrant {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        // Prevent refunding tokens on a contract where conditional funding has not been enabled
        uint32 _fundingDuration = state.cfg.fundingDuration;
        require(_fundingDuration > 0, "NOT_CONFIGURED");
        require(
            block.timestamp >= uint256(_fundingDuration) + 1 days,
            "FUNDING_PERIOD_STILL_ACTIVE"
        );
        require(!state.data.fundingTargetReached, "FUNDING_TARGET_WAS_MET");
        require(
            address(this).balance < fundingTargetInWei(),
            "FUNDING_TARGET_WAS_MET"
        );

        uint256 totalRefund = 0;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(ownerOf(_tokenIds[i]) == msg.sender, "MUST_OWN_TOKEN");
            uint256 _pricePaid = state.data.pricePaid[_tokenIds[i]];
            require(
                _pricePaid > 0,
                "TOKEN_WAS_NOT_PURCHASED"
            );
            safeTransferFrom(
                msg.sender,
                0x000000000000000000000000000000000000dEaD,
                _tokenIds[i]
            );
            totalRefund += _pricePaid;
        }

        (bool success, ) = payable(msg.sender).call{value: totalRefund}("");
        require(success, "TRANSFER_FAILED");
    }
```

