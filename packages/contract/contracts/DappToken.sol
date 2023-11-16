// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DappToken {
    //トークン名
    string public name = "DApp Token";
    //トークンシンボル
    string public symbol = "DAPP";
    //トークンの総供給量
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // Solidityマッピングを用いて、トークンを所有する各アカウントの残高を保存
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[msg.sender]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // 暗号通貨交換のように、別のアカウントがトークンを使用できるようにする機能を実装
    // これにより、allowanceマッピングが更新され、アカウントが使用できる金額を確認できる
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // 別アカウントからトークンを転送できるようにする
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
