// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./DappToken.sol";
import "./MockDaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    // これまでにステーキングを行った全てのアドレスを追跡する配列
    address[] public stakers;

    // 投資家のアドレスと彼らのステーキングしたトークン量を紐付
    mapping (address => uint) public stakingBalance;

    // 投資家アドレスをもとに彼らがステーキングを行ったか紐付
    mapping (address => bool) public hasStaked;

    // 投資家の最新のステータスを記録するマッピング
    mapping (address => bool) public isStaking;

    // コントラクトのデプロイ時にのみ実行される初期化処理
    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // ステーキング機能
    function stakeTokens(uint _amount) public {
        // ステーキングされるトークンは0より多いことを確認
        require(_amount > 0, "amount can't be 0");
        // 投資家のトークンをTokenFarm.solに移動
        daiToken.transferFrom(msg.sender, address(this), _amount);
        // 投資家がステーキングしたトークン残高を更新
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // トークン発行機能
    function issueTokens() public {
        // Dappトークンを発行できるのは貴方のみであることを確認
        require(msg.sender == owner, "caller must be the owner");

        //投資家が預けた偽Daiトークンの数を確認し、同量のDappトークンを発行
        for (uint i=0; i < stakers.length; i++) {
            // recipientはDappトークンを受け取る投資家
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // アンステーキング機能
    function unstakeTokens(uint _amount) public {
        //投資家がステーキングした金額を取得be more than 
        uint balance = stakingBalance[msg.sender];
        require(balance > _amount, "staking balance should unstaked amount");
        daiToken.transfer(msg.sender, _amount);
        dappToken.transfer(msg.sender, _amount);
        stakingBalance[msg.sender] = balance - _amount;
        isStaking[msg.sender] = false;
    }
}
