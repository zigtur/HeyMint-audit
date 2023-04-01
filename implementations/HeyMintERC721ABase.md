# HeyMintERC721ABase.sol

## publicMint(uint256 _numTokens) external payable nonReentrant

### Multiple Gas optimization

#### Initial state
Without modifying Ben's code, the gas reporter is:


|  Contract              |  Method              |  Min        |  Max        |  Avg          |  # calls      |
|------------------------|----------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721ABase    |  publicMint          |     118131  |     164976  |       137055  |           19  |



#### Final state
After gas optimization, the gas reporter is:

|  Contract        |  Method            |  Min        |  Max        |  Avg          |  # calls      |
|----------------|-------------------|-----------|-----------|-------------|------------|
|  HeyMintERC721ABase        |  publicMint                                |     117545  |     164390  |       136469  |           19  |


#### Conclusion
Saved gas is not significant enough (~600 gas in average), but some gas seems to have been saved without breaking the code.


#### Gas-Optimized code
```
	/**
     * @notice Allow for public minting of tokens
     * @param _numTokens The number of tokens to mint
     */
    function publicMint(uint256 _numTokens) external payable nonReentrant {
        BaseConfig storage cfg = HeyMintStorage.state().cfg;
        require(cfg.publicSaleActive, "NOT_ACTIVE");
        require(publicSaleTimeIsActive(), "NOT_ACTIVE");
        // Gas optimization
        uint8 _publicMintsAllowedPerAddress = cfg.publicMintsAllowedPerAddress;
        require(
            _publicMintsAllowedPerAddress == 0 ||
                _numberMinted(msg.sender) + _numTokens <=
                _publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        // Gas optimization
        uint8 _publicMintsAllowedPerTransaction = cfg.publicMintsAllowedPerTransaction;
        require(
            _publicMintsAllowedPerTransaction == 0 ||
                _numTokens <= _publicMintsAllowedPerTransaction,
            "MAX_MINTS_EXCEEDED"
        );
        //Gas optimization
        uint256 futureSupply = totalSupply() + _numTokens;
        // Gas optimization
        uint16 _maxSupply = cfg.maxSupply;
        require(
            futureSupply <= _maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 publicPrice = publicPriceInWei();
        if (cfg.heyMintFeeActive) {
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
  
        if (cfg.fundingDuration > 0) {
            uint256 firstTokenIdToMint = _nextTokenId();
            for (uint256 i = 0; i < _numTokens; i++) {
                HeyMintStorage.state().data.pricePaid[
                    firstTokenIdToMint + i
                ] = publicPrice;
            }
        }
  
        _safeMint(msg.sender, _numTokens);
  
        // Using _maxSupply local variable, as maxSupply has not been modified in function
        // Gas Optimization 1: As you already checked before that totalSupply() + numTokens <= maxSupply, now you can only check that is is ==
        // Gas Optimization 2: You already know this new totalSupply (= (old) totalSupply + _numTokens)
        if (futureSupply == _maxSupply) {
            cfg.publicSaleActive = false;
        }
    }
```

