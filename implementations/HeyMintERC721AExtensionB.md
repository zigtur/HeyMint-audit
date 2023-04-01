
## presaleMint

### Multiple Gas optimization
#### Initial state
Without modifying Ben's code, the gas reporter is:


|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionB  |  presaleMint                                |         -  |     -  |       127778  |           2  |



#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|--------------|---------------|
|  HeyMintERC721AExtensionB        |  presaleMint                                |     -  |     -  |       126785  |           2  |


### Conclusion
Almost 1000 gas optimized per call. For 1000 users, this is 1_000_000 gas!



