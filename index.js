// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// take cli arguments for user account input
// node index.js account=${SOLANA_PUBLIC_KEY}
const args = process.argv
    .slice(2)
    .map(arg => arg.split('='))
    .reduce((args, [value, key]) => {
        args[value] = key || true;
        return args;
    }, {});

// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
console.log(publicKey);
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(args.account)
        );
        console.log(`Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey(privateKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(args.account),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

mainFunction();