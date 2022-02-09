const { assert } = require('chai')

const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        // Load contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mock Tethers to customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('Matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })

    describe('Reward Token', async () => {
        it('Matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('Matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('Rewards tokens for staking', async () => {
            let result
            // check investor baalnce
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking');

            // check staking for customer of 100 coins
            await tether.approve(decentralBank.address, tokens('100'), {from: customer});
            await decentralBank.depositTokens(tokens('100'), {from: customer});

            // check updated balance of customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking');
            
            // check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'), 'customer decentral bank mock wallet balance after staking');
            
            // is staking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer is staking status after staking');

            // Issue tokens
            await decentralBank.issueTokens({from: owner});

            // Ensure only the owner can issue tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            // unstake tokens
            await decentralBank.unstakeTokens({from: customer});

            // check unstaking balances
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking');
            
            // check updated balance of decentral bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'customer decentral bank mock wallet balance after unstaking');
            
            // is staking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'customer is no longer staking status after untaking');
        })
    })
})