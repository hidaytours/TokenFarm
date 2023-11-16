const hre = require("hardhat");
const { assert, expect } = require('chai');
const web3 = require('web3');
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

function tokens(n) {
    return web3.utils.toWei(n, "ether");
}

// eslint-disable-next-line no-undef
describe("TokenFarm", () => {
    async function deployTokenFixture() {
        const [owner, investor] = await hre.ethers.getSigners();

        // コントラクトのdeploy
        const daitokenContractFactory = await hre.ethers.getContractFactory("DaiToken",);
        const dapptokenContractFactory = await hre.ethers.getContractFactory("DappToken",);
        const tokenfarmContractFactory = await hre.ethers.getContractFactory("TokenFarm",);
        const daiToken = await daitokenContractFactory.deploy();
        const dappToken = await dapptokenContractFactory.deploy();
        const tokenFarm = await tokenfarmContractFactory.deploy(
            dappToken.address, 
            daiToken.address, 
        );

        // 全てのDappトークンをファームに移動(1 million)
        await dappToken.transfer(tokenFarm.address, tokens("1000000"));
        // 投資家に100DAIトークンを付与
        await daiToken.transfer(investor.address, tokens("100"));

        return {
            owner,
            investor,
            daiToken,
            dappToken,
            tokenFarm,
        };
    }

    describe("Mock DAI deployment", async () => {
        it("has a name", async () => {
            const { daiToken } = await loadFixture(deployTokenFixture);
            const name = await daiToken.name();
            assert.equal(name, "Mock DAI Token");
        });
    });

    describe("Dapp Token deployment", async () => {
        it("has a name", async () => {
            const { dappToken } = await loadFixture(deployTokenFixture);
            const name = await dappToken.name();
            assert.equal(name, "DApp Token");
        });
    });

    describe("Token Farm deployment", async () => {
        it("has a name", async () => {
            const { tokenFarm } = await loadFixture(deployTokenFixture);
            const name = await tokenFarm.name();
            assert.equal(name, "Dapp Token Farm");
        });

        it("contract has tokens", async () => {
            const { dappToken, tokenFarm } = await loadFixture(deployTokenFixture);
            const balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens("1000000"));
        });
    });

    describe("Farming tokens", async () => {
        it("rewards investor for staking mDai tokens", async () => {
            const { 
                daiToken, 
                dappToken, 
                tokenFarm, 
                investor, 
                owner 
            } = await loadFixture(deployTokenFixture);
            let result;

            // ステーキング前の投資家の偽DAIトークン残高を確認
            result = await daiToken.balanceOf(investor.address);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor Mock DAI wallet balance correct before staking",
            );

            // ステーキング
            await daiToken
                .connect(investor)
                .approve(tokenFarm.address, tokens("100"));
            await tokenFarm.connect(investor).stakeTokens(tokens("100"));

            // ステーキング後の投資家の偽DAIトークン残高を確認
            result = await daiToken.balanceOf(investor.address);
            assert.equal(
                result.toString(),
                tokens("0"),
                "investor Mock DAI wallet balance correct after staking",
            );

            // 投資家がTokenFarmにステーキングした残高を確認
            result = await tokenFarm.stakingBalance(investor.address);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor staking balance correct after staking",
            );

            // ステーキングした投資家の状態を確認
            result = await tokenFarm.isStaking(investor.address);
            assert.equal(
                result.toString(),
                "true",
            );

            await tokenFarm.issueTokens();

            result = await dappToken.balanceOf(investor.address);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor DApp Token wallet balance correct after staking"
            );

            // ownerのみがトークンを発行できることを確認する
            await expect(tokenFarm.connect(investor).issueTokens()).to.be.reverted;

            await tokenFarm.connect(investor).unstakeTokens(tokens("60"));

            result = await daiToken.balanceOf(investor.address);
            assert.equal(
                result.toString(),
                tokens("60"),
                "investor MockDAI wallet balance correct after staking",
            );

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(
                result.toString(),
                tokens("40"),
                "Token Farm MockDAI wallet balance correct after staking",
            );
            
            // 投資家がアンステーキングした後の投資家の残高を確認する
            result = await tokenFarm.stakingBalance(investor.address);
            assert.equal(
                result.toString(),
                tokens("40"),
                "investor staking status correct after staking",
            );
            
            // 投資家がアンステーキングした後の投資家の状態を確認する
            result = await tokenFarm.isStaking(investor.address);
            assert.equal(
                result.toString(),
                "false",
                "investor staking status correct after staking", 
            );
        })
    });
});