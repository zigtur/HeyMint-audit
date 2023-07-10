const { time } = require('@nomicfoundation/hardhat-network-helpers')
const { ethers } = require('hardhat')
const { expect } = require('chai')
const { getSelectors, signMsg, createDepositMerkleTree } = require('./utils.js')
const {
  Contract,
} = require('hardhat/internal/hardhat-network/stack-traces/model')

const baseConfigDefault = {
  projectId: ethers.BigNumber.from(1),
  enforceRoyalties: true,
  royaltyBps: ethers.BigNumber.from(500),
  heyMintFeeActive: true,
  presaleSignerAddress: ethers.constants.AddressZero,
  uriBase:
    'ipfs://bafybeibpt6xsam35k3npeb6dsc26yi7yh65ox4kybkt44dw6zhjowabmyq/',
}

const baseConfigNoFee = {
  projectId: ethers.BigNumber.from(1),
  enforceRoyalties: true,
  royaltyBps: ethers.BigNumber.from(500),
  heyMintFeeActive: false,
  presaleSignerAddress: ethers.constants.AddressZero,
  uriBase:
    'ipfs://bafybeibpt6xsam35k3npeb6dsc26yi7yh65ox4kybkt44dw6zhjowabmyq/',
}

const tokenConfig1 = {
  tokenId: ethers.BigNumber.from(111),
  maxSupply: ethers.BigNumber.from(1000),
  publicSaleActive: true,
  publicPrice: ethers.BigNumber.from(0),
  publicMintsAllowedPerAddress: ethers.BigNumber.from(100),
  usePublicSaleTimes: false,
  publicSaleStartTime: ethers.BigNumber.from(0),
  publicSaleEndTime: ethers.BigNumber.from(0),
  presaleActive: false,
  presalePrice: ethers.BigNumber.from(0),
  presaleMaxSupply: ethers.BigNumber.from(10),
  presaleMintsAllowedPerAddress: ethers.BigNumber.from(10),
  tokenUri: '',
  usePresaleTimes: false,
  presaleStartTime: ethers.BigNumber.from(0),
  presaleEndTime: ethers.BigNumber.from(0),
  freeClaimContractAddress: ethers.constants.AddressZero,
  mintsPerFreeClaim: ethers.BigNumber.from(0),
  freeClaimActive: false,
  burnPayment: ethers.BigNumber.from(0),
  mintsPerBurn: ethers.BigNumber.from(0),
  burnClaimActive: false,
  soulbindingActive: false,
  refundEndsAt: ethers.BigNumber.from(0),
  refundPrice: ethers.BigNumber.from(0),
}

const tokenConfig2 = {
  tokenId: ethers.BigNumber.from(222),
  maxSupply: ethers.BigNumber.from(500),
  publicSaleActive: false,
  publicPrice: ethers.BigNumber.from(0),
  publicMintsAllowedPerAddress: ethers.BigNumber.from(0),
  usePublicSaleTimes: false,
  publicSaleStartTime: ethers.BigNumber.from(0),
  publicSaleEndTime: ethers.BigNumber.from(0),
  presaleActive: true,
  presalePrice: ethers.BigNumber.from(50),
  presaleMaxSupply: ethers.BigNumber.from(500),
  presaleMintsAllowedPerAddress: ethers.BigNumber.from(5),
  tokenUri:
    'ipfs://bafybeibpt6xsam35k3npeb6dsc26yi7yh65ox4kybkt44dw6zhjowa1234/',
  usePresaleTimes: false,
  presaleStartTime: ethers.BigNumber.from(0),
  presaleEndTime: ethers.BigNumber.from(0),
  freeClaimContractAddress: ethers.constants.AddressZero,
  mintsPerFreeClaim: ethers.BigNumber.from(0),
  freeClaimActive: false,
  burnPayment: ethers.BigNumber.from(0),
  mintsPerBurn: ethers.BigNumber.from(0),
  burnClaimActive: false,
  soulbindingActive: false,
  refundEndsAt: ethers.BigNumber.from(0),
  refundPrice: ethers.BigNumber.from(0),
}

const advancedConfigDefault = {
  royaltyPayoutAddress: ethers.constants.AddressZero,
  payoutBasisPoints: [ethers.BigNumber.from(10000)],
  payoutAddresses: [ethers.constants.AddressZero],
  creditCardMintAddresses: [],
  soulbindAdminTransfersPermanentlyDisabled: false,
  soulboundAdminAddress: ethers.constants.AddressZero,
  refundAddress: ethers.constants.AddressZero,
}

const burnTokenERC721Default = {
  contractAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  tokenType: 1,
  tokensPerBurn: 1,
  tokenId: 0,
}

const burnTokenERC1155Default = {
  contractAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
  tokenType: 2,
  tokensPerBurn: 1,
  tokenId: 1,
}

const heyMintFee = ethers.utils.parseEther('0.0007')

describe('HeyMintERC1155', async function () {
  let owner, signer, userA, userB
  let addressRelay, HeyMintERC1155Reference, heyMintERC1155Reference
  let childContractProxied,
    ownerChildContractProxied,
    signerChildContractProxied,
    userAChildContractProxied,
    userBChildContractProxied
  let ownerEnumerableERC721, ownerEnumerableERC1155

  before(async () => {
    // Get signers.
    ;[owner, signer, userA, userB] = await ethers.getSigners()

    // Deploy address relay.
    const AddressRelay = await ethers.getContractFactory('AddressRelay')
    addressRelay = await AddressRelay.deploy({
      gasLimit: 10000000,
    })
    await addressRelay.deployed()

    // Deploy implementation contracts.
    const usedSelectors = []
    const implContractNames = [
      'HeyMintERC1155ExtensionA',
      'HeyMintERC1155ExtensionB',
      'HeyMintERC1155ExtensionC',
      'HeyMintERC1155ExtensionD',
      'HeyMintERC1155ExtensionE',
      'HeyMintERC1155ExtensionF',
      'HeyMintERC1155ExtensionG',
    ]
    const implContracts = []
    for (const contractName of implContractNames) {
      const Impl = await ethers.getContractFactory(contractName)
      const impl = await Impl.deploy({
        gasLimit: 10000000,
      })
      await impl.deployed()
      const rawSelectors = getSelectors(impl)
      const dedupedSelectors = rawSelectors.filter(
        (selector) => !usedSelectors.includes(selector)
      )
      usedSelectors.push(...dedupedSelectors)
      implContracts.push({
        implAddress: impl.address,
        selectors: dedupedSelectors,
      })
    }

    // Add implementation contracts to address relay.
    for (const implContract of implContracts) {
      const tx = await addressRelay.addOrUpdateSelectors(
        implContract.selectors,
        implContract.implAddress
      )
      const receipt = await tx.wait()
      if (!receipt.status) {
        throw Error(`Adding implementation contract failed: ${tx.hash}`)
      }
    }
    const tx = await addressRelay.setFallbackImplAddress(
      implContracts[0].implAddress
    )
    const receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Setting fallback implementation contract failed: ${tx.hash}`)
    }
    HeyMintERC1155Reference = await ethers.getContractFactory(
      'HeyMintERC1155Reference'
    )
    heyMintERC1155Reference = await HeyMintERC1155Reference.deploy()
    await heyMintERC1155Reference.deployed()
  })

  beforeEach(async () => {
    const ChildContract = await ethers.getContractFactory('HeyMintERC1155Child')
    const childContract = await ChildContract.deploy(
      'HeyMint Child Test Contract',
      'HMCTC',
      addressRelay.address,
      heyMintERC1155Reference.address,
      baseConfigDefault,
      [tokenConfig1, tokenConfig2],
      {
        gasLimit: 10000000,
      }
    )
    await childContract.deployed()
    childContractProxied = HeyMintERC1155Reference.attach(childContract.address)
    ownerChildContractProxied = childContractProxied.connect(owner)
    signerChildContractProxied = childContractProxied.connect(signer)
    userAChildContractProxied = childContractProxied.connect(userA)
    userBChildContractProxied = childContractProxied.connect(userB)

    const EnumerableERC721 = await ethers.getContractFactory('EnumerableERC721')
    const enumerableERC721 = await EnumerableERC721.deploy()
    await enumerableERC721.deployed()
    ownerEnumerableERC721 = enumerableERC721.connect(owner)

    const EnumerableERC1155 = await ethers.getContractFactory(
      'EnumerableERC1155'
    )
    const enumerableERC1155 = await EnumerableERC1155.deploy()
    await enumerableERC1155.deployed()
    ownerEnumerableERC1155 = enumerableERC1155.connect(owner)
  })



  describe('presaleMint - Presale users can lose presale mints because of other users', async () => {
    beforeEach(async () => {
      await ownerChildContractProxied.setPresaleSignerAddress(signer.address)
      await ownerChildContractProxied.setTokenPresaleState(
        tokenConfig1.tokenId,
        true
      )
    })
    
    it('Presale users can lose presale mints because of other users - mintToken case', async () => {
      const heymintFee = await childContractProxied.heymintFeePerToken()
      const presalePrice = await childContractProxied.presalePriceInWei(
        tokenConfig1.tokenId
      )
      const publicPrice = await childContractProxied.publicPriceInWei(
        tokenConfig1.tokenId
      )
      await ownerChildContractProxied.setTokenPresaleState(
        tokenConfig1.tokenId,
        true
      )
      const { hashMsg, sig } = await signMsg(
        signer,
        userA,
        5,
        tokenConfig1.tokenId
      )

      // as presaleMaxSupply == 10
      // normal user B mints 10 tokens
      await userBChildContractProxied.mintToken(
          tokenConfig1.tokenId,
          10,
          {
            value: ethers.BigNumber.from(heymintFee).add(publicPrice).mul(10),
          }
        );

      // Presale User A tries to use its presale
      // It reverts
      await expect(
        userAChildContractProxied.presaleMint(
          hashMsg,
          sig,
          tokenConfig1.tokenId,
          1,
          5,
          {
            value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(1),
          }
        )
      ).to.be.revertedWith('MAX_SUPPLY_EXCEEDED')
    })

    it('Presale users can lose presale mints because of other users - giftTokens case', async () => {
        const heymintFee = await childContractProxied.heymintFeePerToken()
        const presalePrice = await childContractProxied.presalePriceInWei(
          tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          5,
          tokenConfig1.tokenId
        )
  
        // as presaleMaxSupply == 10
        // give 10 tokens to normal user B
        await childContractProxied.giftTokens(
            tokenConfig1.tokenId,
            [userB.address],
            [10],
            { value: (await childContractProxied.heymintFeePerToken()) * (10 / 10) }
          )
  
        // Presale User A tries to use its presale
        // It reverts
        await expect(
          userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            1,
            5,
            {
              value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(1),
            }
          )
        ).to.be.revertedWith('MAX_SUPPLY_EXCEEDED')
      })
  })


  describe('presaleMint - Presale users can lose presale mints, if they use normal mint', async () => {
    beforeEach(async () => {
        await ownerChildContractProxied.setPresaleSignerAddress(signer.address)
        await ownerChildContractProxied.setTokenPresaleState(
            tokenConfig1.tokenId,
            true
          )
      })

    it('Presale users can lose presale mints, if they use normal mint - mintToken and MAX_MINTS_PER_ADDRESS_EXCEEDED case', async () => {
        await ownerChildContractProxied.setTokenPresaleMintsAllowedPerAddress(
          tokenConfig1.tokenId,
          5
        )
        const heymintFee = await childContractProxied.heymintFeePerToken()
        const presalePrice = await childContractProxied.presalePriceInWei(
            tokenConfig1.tokenId
        )
        const publicPrice = await childContractProxied.publicPriceInWei(
            tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          3,
          tokenConfig1.tokenId
        )
        // presale user A uses normal mint to get 15 tokens
        await userAChildContractProxied.mintToken(
          tokenConfig1.tokenId,
          15,
          {
            value: ethers.BigNumber.from(heymintFee).add(publicPrice).mul(15),
          }
        )
        
        // presale user A tries to use presale mint to get 3 tokens, he should be able to use his tickets
        // but here, it will revert
        await expect(
          userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            3,
            3,
            {
              value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(3),
            }
          )
        ).to.be.revertedWith('MAX_MINTS_PER_ADDRESS_EXCEEDED')
    })
    it('Presale users can lose presale mints, if they use normal mint - mintToken and MAX_MINTS_EXCEEDED case', async () => {
        await ownerChildContractProxied.setTokenPresaleMintsAllowedPerAddress(
          tokenConfig1.tokenId,
          5
        )
        const heymintFee = await childContractProxied.heymintFeePerToken()
        const presalePrice = await childContractProxied.presalePriceInWei(
            tokenConfig1.tokenId
        )
        const publicPrice = await childContractProxied.publicPriceInWei(
            tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          3,
          tokenConfig1.tokenId
        )
        // presale user A uses normal mint to get 15 tokens
        await userAChildContractProxied.mintToken(
          tokenConfig1.tokenId,
          1,
          {
            value: ethers.BigNumber.from(heymintFee).add(publicPrice).mul(1),
          }
        )
        
        // presale user A tries to use presale mint to get 3 tokens, he should be able to use his tickets
        // but here, it will revert
        await expect(
          userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            3,
            3,
            {
              value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(3),
            }
          )
        ).to.be.revertedWith('MAX_MINTS_EXCEEDED')
    })

    it('Presale users can lose presale mints, if they use normal mint - freeClaim and MAX_MINTS_PER_ADDRESS_EXCEEDED case', async () => {
        await ownerChildContractProxied.setTokenPresaleMintsAllowedPerAddress(
          tokenConfig1.tokenId,
          5
        )
        const heymintFee = await childContractProxied.heymintFeePerToken()
        const presalePrice = await childContractProxied.presalePriceInWei(
            tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          3,
          tokenConfig1.tokenId
        )
        //// give 5 tokens to user A
        await ownerEnumerableERC721.gift([userA.address], 100)
        await ownerChildContractProxied.setFreeClaimContractAddress(
            tokenConfig1.tokenId,
            ownerEnumerableERC721.address
        )
        await ownerChildContractProxied.updateMintsPerFreeClaim(
            tokenConfig1.tokenId,
            5
        )
        await ownerChildContractProxied.setFreeClaimState(
            tokenConfig1.tokenId,
            true
        )
        const fee = await childContractProxied.heymintFeePerToken()
        expect(
            await userAChildContractProxied.freeClaim(tokenConfig1.tokenId, [5], {
            value: fee.mul(5),
            })
        ).to.not.be.reverted
        
        // presale user A tries to use presale mint to get 3 tokens, he should be able to use his tickets
        // but here, it will revert
        await expect(
          userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            3,
            3,
            {
              value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(3),
            }
          )
        ).to.be.revertedWith('MAX_MINTS_PER_ADDRESS_EXCEEDED')
    })
  })



  describe('presaleMint - Presale tickets can be reused on other childs, if owner uses same signer address', async () => {
    beforeEach(async () => {
        await ownerChildContractProxied.setPresaleSignerAddress(signer.address)
        await ownerChildContractProxied.setTokenPresaleState(
            tokenConfig1.tokenId,
            true
          )
      })
    it('Presale tickets can be reused on other childs, if owner uses same signer address', async () => {
        const ChildContract2 = await ethers.getContractFactory('HeyMintERC1155Child')
        const childContract2 = await ChildContract2.deploy(
        'HeyMint Child Test Contract 2',
        'HMCTC2',
        addressRelay.address,
        heyMintERC1155Reference.address,
        baseConfigDefault,
        [tokenConfig1, tokenConfig2],
        {
            gasLimit: 10000000,
        }
        )
        await childContract2.deployed()
        childContractProxied2 = HeyMintERC1155Reference.attach(childContract2.address)
        ownerChildContractProxied2 = childContractProxied2.connect(owner)
        signerChildContractProxied2 = childContractProxied2.connect(signer)
        userAChildContractProxied2 = childContractProxied2.connect(userA)

        await ownerChildContractProxied2.setPresaleSignerAddress(signer.address);
        await ownerChildContractProxied2.setTokenPresaleState(
            tokenConfig1.tokenId,
            true
          )



        const heymintFee = await childContractProxied.heymintFeePerToken()
        const price = await childContractProxied.presalePriceInWei(
          tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          5,
          tokenConfig1.tokenId
        )
        // Presale ticket works on the first child
        // which is normal and good
        expect(
          await userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            1,
            5,
            {
              value: ethers.BigNumber.from(heymintFee).add(price).mul(1),
            }
          )
        ).to.not.be.reverted
        // Presale ticket also works on the second child
        // which is not wanted by owner
        expect(
            await userAChildContractProxied2.presaleMint(
              hashMsg,
              sig,
              tokenConfig1.tokenId,
              1,
              5,
              {
                value: ethers.BigNumber.from(heymintFee).add(price).mul(1),
              }
            )
          ).to.not.be.reverted
      })
    })


  describe('Presale users will not be able to mint all their public mint tokens', async () => {
      beforeEach(async () => {
        await ownerChildContractProxied.setPresaleSignerAddress(signer.address)
        await ownerChildContractProxied.setTokenPresaleState(
            tokenConfig1.tokenId,
            true
          )
      })

      it('Presale users will not be able to mint all their public mint tokens', async () => {
        const heymintFee = await childContractProxied.heymintFeePerToken()
        const presalePrice = await childContractProxied.presalePriceInWei(
          tokenConfig1.tokenId
        )
        const publicPrice = await childContractProxied.publicPriceInWei(
          tokenConfig1.tokenId
        )
        await ownerChildContractProxied.setTokenPresaleState(
          tokenConfig1.tokenId,
          true
        )
        const { hashMsg, sig } = await signMsg(
          signer,
          userA,
          5,
          tokenConfig1.tokenId
        )
        
        // Set tokenPublicMintsAllowedPerAddress = 10
        await ownerChildContractProxied.setTokenPublicMintsAllowedPerAddress(
            tokenConfig1.tokenId,
            10
        )
  
        // Presale User A mints 3 tokens out of 5 using its presale ticket
        await expect(
          userAChildContractProxied.presaleMint(
            hashMsg,
            sig,
            tokenConfig1.tokenId,
            3,
            5,
            {
              value: ethers.BigNumber.from(heymintFee).add(presalePrice).mul(3),
            }
          )
        ).to.not.be.reverted

        // Presale User A tries to mint 9 tokens
        // He should be able because he can "normal mints" 10 tokens
        // It reverts because he presale minted 3
        await expect(
            userAChildContractProxied.mintToken(
                tokenConfig1.tokenId,
                9,
              {
                value: ethers.BigNumber.from(heymintFee).add(publicPrice).mul(9),
              }
            )
          ).to.be.revertedWith('MAX_MINTS_FOR_ADDRESS_EXCEEDED')

      })
  })


  describe('upsertToken', async () => {
    it('Token metadata can be changed even if allMetadataFrozen is true', async () => {
      expect(await ownerChildContractProxied.freezeAllMetadata()).not.to.be.reverted
      expect(
        await ownerChildContractProxied.upsertToken({
          ...tokenConfig1,
          tokenUri: "https://github.com/zigtur",
          publicPrice: ethers.BigNumber.from(5000),
        })
      ).to.not.be.reverted
      expect(await ownerChildContractProxied.tokenURI(111)).to.be.eq("https://github.com/zigtur");
    })
  })

  describe('creditCardMint', async () => {
    it('Users can max out tokenPublicMintsAllowedPerAddress by using creditCardMint', async () => {
        await ownerChildContractProxied.setTokenPublicPrice(
            tokenConfig1.tokenId,
            500
        )
        await ownerChildContractProxied.setCreditCardMintAddresses([
          userB.address,
        ])
        const price = await childContractProxied.publicPriceInWei(
          tokenConfig1.tokenId
        )
        const fee = await childContractProxied.heymintFeePerToken()

        // Set tokenPublicMintsAllowedPerAddress = 10
        await ownerChildContractProxied.setTokenPublicMintsAllowedPerAddress(
            tokenConfig1.tokenId,
            10
        )

        // user can't max out with one transaction (because of the check)
        await expect(
            userBChildContractProxied.creditCardMint(
              tokenConfig1.tokenId,
              11,
              userA.address,
              { value: price.add(fee).mul(11) }
            )
        ).to.be.revertedWith('MAX_MINTS_EXCEEDED')

        // user can max out by using multiple transactions
        for (let i = 0; i < 15; i++) {
            await expect(
            userBChildContractProxied.creditCardMint(
                tokenConfig1.tokenId,
                10,
                userA.address,
                { value: price.add(fee).mul(10) }
            )
            ).to.not.be.reverted
        }

        // Verify that user's balance is more than publicMintsAllowedPerAddress
        const [settings] = await childContractProxied.getTokenSettings(
            tokenConfig1.tokenId
        )
        expect(settings.publicMintsAllowedPerAddress).to.lessThan(await childContractProxied.balanceOf(userA.address, tokenConfig1.tokenId));
    })
  })

})
