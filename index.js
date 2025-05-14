require('dotenv').config();
const { ethers } = require('ethers');
const readline = require('readline');
const chalk = require('chalk');
const routerAbi = require('./UniswapV2Router02.json');
const factoryAbi = require('./UniswapV2Factory.json');
const erc20Abi = require('./ERC20.json');
// const erc20Bytecode = require('./ERC20Bytecode.json'); // Uncomment and provide if you want to deploy tokens

// ======= SET YOUR DEX ROUTER/FACTORY ADDRESSES =======
const ROUTER_ADDRESS  = "0x81Be083099c2C65b062378E74Fa8469644347BB7"; // Example XRiSE33 Router
const FACTORY_ADDRESS = "0x0c28777DEebe4589e83EF2Dc7833354e6a0aFF85"; // Example XRiSE33 Factory
// =====================================================

// ======= XRPL EVM TOKEN ADDRESSES =======
const tokens = {
  XRP:    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  RISE:   "0x0c28777DEebe4589e83EF2Dc7833354e6a0aFF85",
  RIBBIT:};
// ========================================

const privateKeys = Object.keys(process.env)
  .filter(k => k.startsWith('PRIVATE_KEY'))
  .map(k => process.env[k]);

if (!process.env.RPC_URL) {
  console.error(chalk.red("ERROR: RPC_URL is not set in your .env file!"));
  process.exit(1);
}
if (!privateKeys.length) {
  console.error(chalk.red("ERROR: At least one PRIVATE_KEY is required in your .env file!"));
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

function printBanner() {
  console.log(
    chalk.cyan.bold(`
╔═══════════════════════════════════════════════╗
║        🚀 XRPL EVM MULTI-BOT TERMINAL 🚀     ║
║                by @PetrukStar                ║
╚═══════════════════════════════════════════════╝
`)
  );
}

function printMenu() {
  console.log(chalk.yellow('\n✨ Main Menu ✨'));
  console.log(chalk.green('1. 🔄  Swap XRPL to RISE'));
  console.log(chalk.green('2. 🐸  Swap XRPL to RIBBIT'));
  console.log(chalk.green('3. 💱  Swap XRPL to WXRP'));
  console.log(chalk.green('4. 🔁  Custom token swap'));
  console.log(chalk.blue('5. 💧 Add Liquidity'));
  console.log(chalk.magenta('6. 🪙 Deploy Token'));
  console.log(chalk.cyan('7. 📤 Transfer token (random/target address)'));
  console.log(chalk.red('Type exit to quit'));
}

function getRandomAddress() {
  const randomBytes = ethers.randomBytes(20);
  return ethers.hexlify(randomBytes);
}

async function approveIfNeeded(tokenAddress, wallet, spender, amount) {
  if (tokenAddress === tokens.XRP) return;
  const erc20 = new ethers.Contract(tokenAddress, [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 value) public returns (bool)"
  ], wallet);

  const owner = await wallet.getAddress();
  const allowance = await erc20.allowance(owner, spender);
  if (allowance < amount) {
    const tx = await erc20.approve(spender, amount);
    await tx.wait();
    console.log(chalk.blueBright(`Approved ${tokenAddress}: ${tx.hash}`));
  }
}

async function swapToken(wallet, tokenIn, tokenOut, amountIn, toAddr) {
  const router = new ethers.Contract(ROUTER_ADDRESS, routerAbi, wallet);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  await approveIfNeeded(tokenIn, wallet, ROUTER_ADDRESS, amountIn);
  let amountOutMin = 0;
  const path = [tokenIn, tokenOut];
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    toAddr,
    deadline
  );
  console.log(chalk.greenBright(`Swap tx: ${tx.hash}`));
  await tx.wait();
  console.log(chalk.green('✅ Swap completed!'));
}

async function addLiquidity(wallet, tokenA, tokenB, amtA, amtB) {
  const router = new ethers.Contract(ROUTER_ADDRESS, routerAbi, wallet);
  await approveIfNeeded(tokenA, wallet, ROUTER_ADDRESS, amtA);
  await approveIfNeeded(tokenB, wallet, ROUTER_ADDRESS, amtB);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const tx = await router.addLiquidity(
    tokenA, tokenB, amtA, amtB, 0, 0, await wallet.getAddress(), deadline
  );
  console.log(chalk.greenBright(`Add Liquidity tx: ${tx.hash}`));
  await tx.wait();
  console.log(chalk.green('💧 Add Liquidity completed!'));
}

async function deployToken(wallet, name, symbol, supply) {
  // Uncomment and provide bytecode if you want to deploy ERC20 tokens
  // const factory = new ethers.ContractFactory(erc20Abi, erc20Bytecode, wallet);
  // const decimals = 18;
  // const totalSupply = ethers.parseUnits(supply, decimals);
  // const contract = await factory.deploy(name, symbol, totalSupply);
  // await contract.waitForDeployment();
  // console.log(chalk.green(`Token deployed at: ${contract.target}`));
  // return contract.target;
  console.log(chalk.red("Deploying token requires ERC20 bytecode. Please add the bytecode and uncomment the related code."));
}

async function transferToken(wallet, tokenAddress, toAddr, amount) {
  if (tokenAddress === tokens.XRP) {
    const tx = await wallet.sendTransaction({ to: toAddr, value: amount });
    await tx.wait();
    console.log(chalk.green(`Native transfer completed: ${tx.hash}`));
  } else {
    const token = new ethers.Contract(tokenAddress, erc20Abi, wallet);
    const tx = await token.transfer(toAddr, amount);
    await tx.wait();
    console.log(chalk.green(`Token transfer completed: ${tx.hash}`));
  }
}

async function menu() {
  printBanner();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  function ask(q) { return new Promise(r => rl.question(q, r)); }
  let action;

  while (action !== "exit") {
    printMenu();
    action = (await ask(chalk.yellow.bold("Choose menu: "))).trim();
    if (!["1","2","3","4","5","6","7"].includes(action) && action !== "exit") continue;

    for (const pk of privateKeys) {
      const wallet = new ethers.Wallet(pk, provider);
      const addr = await wallet.getAddress();
      console.log(chalk.bgBlackBright(`\n=== Wallet: ${addr} ===`));

      try {
        if (action === "1" || action === "2" || action === "3") {
          const amount = await ask("Amount of XRPL (e.g. 0.5): ");
          const toOpt = (await ask("Type 'random' for random address or enter destination address: ")).trim();
          const toAddr = (toOpt === "random") ? getRandomAddress() : toOpt;
          let tokenOut;
          if (action === "1") tokenOut = tokens.RISE;
          if (action === "2") tokenOut = tokens.RIBBIT;
          if (action === "3") tokenOut = tokens.WXRP;
          const amountIn = ethers.parseUnits(amount, 18);
          await swapToken(wallet, tokens.XRP, tokenOut, amountIn, toAddr);
        }
        else if (action === "4") {
          const tIn = (await ask("TokenIn symbol (XRP/RISE/RIBBIT/WXRP): ")).trim().toUpperCase();
          const tOut = (await ask("TokenOut symbol (XRP/RISE/RIBBIT/WXRP): ")).trim().toUpperCase();
          const amount = await ask("Amount of tokenIn: ");
          const toOpt = (await ask("Type 'random' for random address or enter destination address: ")).trim();
          const toAddr = (toOpt === "random") ? getRandomAddress() : toOpt;
          const amountIn = ethers.parseUnits(amount, 18);
          await swapToken(wallet, tokens[tIn], tokens[tOut], amountIn, toAddr);
        }
        else if (action === "5") {
          const tA = (await ask("TokenA symbol: ")).trim().toUpperCase();
          const tB = (await ask("TokenB symbol: ")).trim().toUpperCase();
          const amtA = ethers.parseUnits(await ask("Amount of TokenA: "), 18);
          const amtB = ethers.parseUnits(await ask("Amount of TokenB: "), 18);
          await addLiquidity(wallet, tokens[tA], tokens[tB], amtA, amtB);
        }
        else if (action === "6") {
          const name = await ask("Token name: ");
          const symbol = await ask("Token symbol: ");
          const supply = await ask("Total supply (e.g. 1000000): ");
          await deployToken(wallet, name, symbol, supply);
        }
        else if (action === "7") {
          const tSym = (await ask("Token symbol (XRP/RISE/RIBBIT/WXRP): ")).trim().toUpperCase();
          const amount = ethers.parseUnits(await ask("Amount: "), 18);
          const toOpt = (await ask("Type 'random' for random address or enter destination address: ")).trim();
          const toAddr = (toOpt === "random") ? getRandomAddress() : toOpt;
          await transferToken(wallet, tokens[tSym], toAddr, amount);
        }
      } catch (err) {
        console.error(chalk.red("Error: " + (err.message || err)));
      }
    }
  }
  rl.close();
}

menu();