pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner= msg.sender;
    }

    // staking function
    function depositTokens(uint _amount) public {
        // require staking amount to be greater than 0
        require(_amount > 0, 'amount cannot be 0');

        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cant be less than zero');

        // transfer the tokens to the spoecified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // update staking status
        isStaking[msg.sender] = false;
    }   

    // issue rewards
    function issueTokens() public {
        // require the owner to issue tokens only
        require(msg.sender == owner, 'caller must be the owner');

        for(uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // /9 to create percentage incentive
            if(balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}