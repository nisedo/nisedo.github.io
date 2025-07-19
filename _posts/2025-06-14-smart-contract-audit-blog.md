---
layout: default
title: "Smart Contract Audit Methodologies: A Practical Guide"
author: nisedo
---

# Smart Contract Audit Methodologies: A Practical Guide

## Methodologies

There are multiple ways to perform a smart contract audit. We'll go through some of the main techniques:

- Static Analysis/Grep for bugs
- Following user inputs and state changes
- Read all the code
- Check one functionality at a time (deposit, withdraw, staking, claiming rewards...)

### Static Analysis/Grep for bugs

This is probably the fastest way to find low-hanging fruits; you just try to find patterns of known vulnerabilities. For example, you can use grep to find calls to dangerous Solidity functions:

```bash
$ grep -R 'call(' *
$ grep -R 'delegatecall(' *
$ grep -R 'selfdestruct(' *
```

You can find a list of regular expressions to try on your smart contract codebase in various automated audit tools like Slither patterns.

This approach suffers from many limitations:

- You don't get much coverage/assurance on the quality (and therefore security) of the smart contract code. You only know that, based on your list of patterns, you couldn't find any issue.
- You need to know all the dangerous functions/patterns specific to smart contracts.
- You may end up using very complex regular expressions for Solidity-specific vulnerabilities.

### Following user inputs and state changes

Another way to approach a smart contract audit is to follow all the user-controlled inputs and identify all the ways to interact with the contract (the public/external functions available), for example in Solidity:

- `msg.sender`
- `msg.value`
- Function parameters
- `msg.data`
- `tx.origin`
- External contract calls and their return values
- Oracle data feeds
- Time-dependent values (`block.timestamp`, `block.number`)
- ...

This method provides good coverage. However, you will need a good understanding of the blockchain platform and smart contract frameworks used. Finally, you may end up reviewing the same function again and again if it's called multiple times across different contract interactions.

### Read everything

The more time-consuming way: just start reading the code one contract at a time. A better way to do this is to try to find weaknesses, not vulnerabilities. From there, you can see if the weaknesses can become vulnerabilities on their own or by chaining them.

This method is obviously the most laborious way of working, but it brings excellent coverage. It's crucial to keep good notes when using this approach, especially when dealing with complex DeFi protocols with multiple interacting contracts.

### By functionality

Another common way to do an audit is to pick one functionality (at a time), for example:

- "User deposits"
- "User withdraws"
- "User stakes"
- "User claims rewards"
- "Admin pauses protocol"

And review all the code associated with this functionality. This works especially well if you do this across multiple protocols/projects, as they will all have different implementations of similar concepts.

This approach gives you an excellent coverage of the functionality reviewed and will teach you what mistakes people typically make for a given functionality in smart contracts. However, you only have coverage of what you reviewed.

## What to look for?

When doing a smart contract audit, you need to look for everything:

- **Weird behaviors**: Unusual state transitions, unexpected function interactions
- **Missing checks**: Access control missing, integer overflow/underflow protection absent
- **Complexity**: Overly complex logic that's hard to reason about, especially in financial calculations
- **Security checks already in place**: ReentrancyGuard, SafeMath usage, proper modifiers
- **Differences between 2 functions/methods/contracts**: Inconsistent validation patterns
- **Comparisons and conditions (if/else)**: Off-by-one errors, incorrect boundary checks
- **Mathematical operations**: Division before multiplication, precision loss
- **What is missing?**: Events for important state changes, proper error handling

### Smart Contract Specific Weaknesses to Look For:

**Reentrancy vulnerabilities**: Functions that make external calls before updating state variables.

**Integer overflow/underflow**: Mathematical operations without proper bounds checking (especially in older Solidity versions).

**Access control issues**: Functions missing `onlyOwner` or proper role-based modifiers, or using `tx.origin` instead of `msg.sender`.

**Front-running vulnerabilities**: Transactions that can be exploited by MEV bots due to predictable behavior.

**Oracle manipulation**: Price feeds that can be manipulated or don't have proper validation.

**Gas limit issues**: Unbounded loops that could cause out-of-gas errors, or functions that consume too much gas.

**Time manipulation**: Reliance on `block.timestamp` for critical logic without considering miner manipulation.

**Approval race conditions**: ERC20 approve/transferFrom patterns that allow double-spending.

You will probably encounter functions, libraries and design patterns you aren't currently aware of. To solve this issue, you need to:

- Research them in smart contract security resources
- Test their behavior on testnets
- Understand their gas implications

It's going to take time (especially early on), but the more smart contracts you audit, the easier it gets.

Make sure you create test scenarios with the function/pattern to test its behavior. This will make future audits far simpler. To test it, you will need to deploy contracts locally (using Hardhat/Foundry) and try to find some edge cases that the developers may have missed.

## Hands-on - First Flight #XX

For this exercise, you have a really simple DeFi protocol. We are going to go with the "read everything" approach as there isn't that much smart contract code to read.

To get started, don't focus on finding vulnerabilities, try to find weaknesses, some thoughts to keep in mind are:

- "What doesn't seem right"
- "What happens if I call this function with [X] parameters"
- "What if the price oracle returns unexpected values"
- "What if this external call fails or reverts"

Then, try to see if these weaknesses can become vulnerabilities. Either on their own or by chaining them.
