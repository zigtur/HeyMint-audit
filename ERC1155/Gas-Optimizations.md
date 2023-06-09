# Gas Optimization

Default results:
```
·-------------------------------------------------------------------------|---------------------------|--------------|-----------------------------·
|                          Solc version: 0.8.18                           ·  Optimizer enabled: true  ·  Runs: 1000  ·  Block limit: 30000000 gas  │
··········································································|···························|··············|······························
|  Methods                                                                                                                                         │
·····························|············································|·············|·············|··············|···············|··············
|  Contract                  ·  Method                                    ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  addOrUpdateSelectors                      ·     195818  ·     904346  ·      429263  ·          266  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  freezeRelay                               ·          -  ·          -  ·       28444  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  removeImplAddressAndAllSelectors          ·          -  ·          -  ·      374352  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  removeSelectors                           ·          -  ·          -  ·       34947  ·            2  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  setFallbackImplAddress                    ·      26356  ·      46256  ·       45261  ·           40  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  transferOwnership                         ·          -  ·          -  ·       38783  ·            1  ·          -  │
·····························|············································|·············|·············|··············|···············|··············
|  AddressRelay              ·  updateSupportedInterfaces                 ·          -  ·          -  ·       46190  ·            2  ·          -  │
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



## AddressRelay






