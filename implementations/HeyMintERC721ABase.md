# HeyMintERC721ABase.sol

## initialize

### startTime and endTime
In the config, multiple checks are done. But if `publicSaleStartTime` is not set, then `publicSaleEndTime` will be ignored.

As a NFT creator, this could be annoying. Maybe setting `publicSaleStartTime` as current timestamp may be better.

If  `publicSaleStartTime` is set to current timestamp, then there must be a check that `publicSaleStartTime < publicSaleEndTime`.

The same should apply to `presaleStartTime` and `presaleEndTime`.



#### Ben's code proposition
Talking with Ben, he did modify a little bit his code and send it to me:
```solidity
	/**
     * @notice Initializes a new child deposit contract
     * @param _name The name of the token
     * @param _symbol The symbol of the token
     * @param _config Base configuration settings
     */
    function initialize(
        string memory _name,
        string memory _symbol,
        BaseConfig memory _config
    ) public initializerERC721A {
        __ERC721A_init(_name, _symbol);
        __Ownable_init();
        __ReentrancyGuard_init();
        __OperatorFilterer_init(
            _config.enforceRoyalties == true
                ? CORI_SUBSCRIPTION_ADDRESS
                : EMPTY_SUBSCRIPTION_ADDRESS,
            true
        );

        HeyMintStorage.state().cfg = _config;

        // If public sale start time is set but end time is not, set default end time
        if (_config.publicSaleStartTime > 0 && _config.publicSaleEndTime == 0) {
            HeyMintStorage.state().cfg.publicSaleEndTime =
                _config.publicSaleStartTime +
                520 weeks;
        }

        // If public sale end time is set but not start time, set default start time
        if (_config.publicSaleEndTime > 0 && _config.publicSaleStartTime == 0) {

            HeyMintStorage.state().cfg.publicSaleStartTime = uint32(
                block.timestamp
            );
        }

        // If presale start time is set but end time is not, set default end time
        if (_config.presaleStartTime > 0 && _config.presaleEndTime == 0) {
            HeyMintStorage.state().cfg.presaleEndTime =
                _config.presaleStartTime +
                520 weeks;
        }

        // If presale end time is set but not start time, set default start time
        if (_config.presaleEndTime > 0 && _config.presaleStartTime == 0) {
            HeyMintStorage.state().cfg.presaleStartTime = uint32(
                block.timestamp
            );
        }
    }
```

#### Proposition review
I think the `publicSaleStartTime < publicSaleEndTime` and `presaleStartTime < presaleEndTime` checks are missing.

## publicMint

### Multiple Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.

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


#### Optimized Code


```solidity
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

