# HeyMintERC721AExtensionC.sol

## crossmint

### Multiple Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.
#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionC  |  crossmint                                |         -  |     -  |       125376  |           2  |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionC  |  crossmint                                |         -  |     -  |       124719  |           2  |


### Conclusion
Almost 700 gas optimized per call. For 1000 users, this is 700_000 gas!

#### Optimized Code

```solidity
    function crossmint(
        uint256 _numTokens,
        address _to
    ) external payable nonReentrant {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        // Gas optimization
        address _tmpCrossmintAddress = state.advCfg.crossmintAddress;
        address crossmintAddress = _tmpCrossmintAddress == address(0)
            ? defaultCrossmintAddress
            : _tmpCrossmintAddress;
        require(msg.sender == crossmintAddress, "NOT_CROSSMINT");
        require(state.cfg.publicSaleActive, "NOT_ACTIVE");
        require(_publicSaleTimeIsActive(), "NOT_ACTIVE");
        // Gas optimization
        uint8 _publicMintsAllowedPerAddress = state.cfg.publicMintsAllowedPerAddress;
        require(
            _publicMintsAllowedPerAddress == 0 ||
                _numberMinted(_to) + _numTokens <=
                _publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        // Gas optimization
        uint8 _publicMintsAllowedPerTransaction = state.cfg.publicMintsAllowedPerTransaction;
        require(
            _publicMintsAllowedPerTransaction == 0 ||
                _numTokens <= _publicMintsAllowedPerTransaction,
            "MAX_MINTS_EXCEEDED"
        );
        // Gas optimization
        uint16 _maxSupply = state.cfg.maxSupply;
        // Gas optimization
        uint256 futureTotalSupply = totalSupply() + _numTokens;
        require(
            futureTotalSupply <= _maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 publicPrice = _publicPriceInWei();
        if (state.cfg.heyMintFeeActive) {
            uint256 heymintFee = _numTokens * heymintFeePerToken;
            require(
                msg.value == publicPrice * _numTokens + heymintFee,
                "INVALID_PRICE_PAID"
            );
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        } else {
            require(
                msg.value == publicPrice * _numTokens,
                "INVALID_PRICE_PAID"
            );
        }

        if (state.cfg.fundingDuration > 0) {
            uint256 firstTokenIdToMint = _nextTokenId();
            for (uint256 i = 0; i < _numTokens; i++) {
                HeyMintStorage.state().data.pricePaid[
                    firstTokenIdToMint + i
                ] = publicPrice;
            }
        }

        _safeMint(_to, _numTokens);

        if (futureTotalSupply == _maxSupply) {
            state.cfg.publicSaleActive = false;
        }
    }
```


## soulboundAdminTransfer
### Multiple Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.
#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method                 |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|-------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionC  |  soulboundAdminTransfer              |         -  |     -  |       107857  |           2  |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                 |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|-------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionC  |  soulboundAdminTransfer              |         -  |     -  |       107760  |           2  |


#### Conclusion
Almost 100 gas saved!

#### Optimized Code

```solidity
    /**
     * @notice Allows an admin address to initiate token transfers if user wallets get hacked or lost
     * This function can only be used on soulbound tokens to prevent arbitrary transfers of normal tokens
     * @param _from The address to transfer from
     * @param _to The address to transfer to
     * @param _tokenId The token id to transfer
     */
    function soulboundAdminTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        // Gas optimization
        address _tmpAdminAddress = state.advCfg.soulboundAdminAddress;
        address adminAddress = _tmpAdminAddress == address(0)
            ? owner()
            : _tmpAdminAddress;
        require(msg.sender == adminAddress, "NOT_ADMIN");
        require(state.cfg.soulbindingActive, "NOT_ACTIVE");
        require(
            !state.advCfg.soulbindAdminTransfersPermanentlyDisabled,
            "NOT_ACTIVE"
        );
        state.data.soulboundAdminTransferInProgress = true;
        _directApproveMsgSenderFor(_tokenId);
        safeTransferFrom(_from, _to, _tokenId);
        state.data.soulboundAdminTransferInProgress = false;
    }

```


## unstakeTokens
### Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.

#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  unstakTokens     |     -  |     -  |   59035  |        6 |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  unstakTokens     |     -  |     -  |   58868  |        6 |


#### Conclusion
Almost 200 gas saved!

#### Code

```solidity
    /**
     * @notice Unstake an arbitrary number of tokens
     * @param _tokenIds The ids of the tokens to unstake
     */
    function unstakeTokens(uint256[] calldata _tokenIds) external {
        Data storage data = HeyMintStorage.state().data;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            require(ownerOf(tokenId) == msg.sender, "MUST_OWN_TOKEN");
            // Gas Optimization
            uint256 _currentTimeStakedForTokenId = data.currentTimeStaked[tokenId];
            if (_currentTimeStakedForTokenId != 0) {
                data.totalTimeStaked[tokenId] +=
                    block.timestamp -
                    _currentTimeStakedForTokenId;
                data.currentTimeStaked[tokenId] = 0;
                emit Unstake(tokenId);
            }
        }
    }
```


## adminUnstake
### Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.

#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  adminUnstake     |     -  |     -  |   58231  |        2 |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  adminUnstake     |     -  |     -  |   58064  |        2 |


#### Conclusion
Approximately 170 gas saved!

#### Code

```solidity
    /**
     * @notice Allow contract owner to forcibly unstake a token if needed
     * @param _tokenId The id of the token to unstake
     */
    function adminUnstake(uint256 _tokenId) external onlyOwner {
        Data storage data = HeyMintStorage.state().data;
        // Gas optimization
        uint256 _currentTimeStakedForTokenId = data.currentTimeStaked[_tokenId];
        require(_currentTimeStakedForTokenId != 0);
        data.totalTimeStaked[_tokenId] +=
            block.timestamp -
            _currentTimeStakedForTokenId;
        data.currentTimeStaked[_tokenId] = 0;
        emit Unstake(_tokenId);
    }
```


## freeClaim
### Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.

#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  freeClaim        |     -  |     -  |   141489 |        4 |


#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method           |  Min   |  Max   |  Avg     |  # calls |
|----------------------------|-------------------|--------|--------|----------|----------|
|  HeyMintERC721AExtensionC  |  freeClaim        |     -  |     -  |   141359 |        4 |


#### Conclusion
Here we saved 130 gas!

#### Code

```solidity
    /**
     * @notice Free claim token when msg.sender owns the token in the external contract
     * @param _tokenIDs The ids of the tokens to redeem
     */
    function freeClaim(
        uint256[] calldata _tokenIDs
    ) external payable nonReentrant {
        HeyMintStorage.State storage state = HeyMintStorage.state();
        uint256 tokenIdsLength = _tokenIDs.length;
        uint256 totalMints = tokenIdsLength * state.advCfg.mintsPerFreeClaim;
        // Gas optimization
        address _freeClaimContractAddress = state.advCfg.freeClaimContractAddress;
        require(
            _freeClaimContractAddress != address(0),
            "NOT_CONFIGURED"
        );
        require(state.advCfg.mintsPerFreeClaim != 0, "NOT_CONFIGURED");
        require(state.advCfg.freeClaimActive, "NOT_ACTIVE");
        require(
            totalSupply() + totalMints <= state.cfg.maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        if (state.cfg.heyMintFeeActive) {
            uint256 heymintFee = totalMints * heymintFeePerToken;
            require(msg.value == heymintFee, "PAYMENT_INCORRECT");
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        }
        IERC721 ExternalERC721FreeClaimContract = IERC721(
            _freeClaimContractAddress
        );
        for (uint256 i = 0; i < tokenIdsLength; i++) {
            require(
                ExternalERC721FreeClaimContract.ownerOf(_tokenIDs[i]) ==
                    msg.sender,
                "MUST_OWN_TOKEN"
            );
            require(
                !state.data.freeClaimUsed[_tokenIDs[i]],
                "TOKEN_ALREADY_CLAIMED"
            );
            state.data.freeClaimUsed[_tokenIDs[i]] = true;
        }
        _safeMint(msg.sender, totalMints);
    }
```




