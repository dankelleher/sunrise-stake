import {Connection, PublicKey, Transaction} from "@solana/web3.js";

export const enum ProgramDerivedAddressSeed {
    G_SOL_MINT_AUTHORITY = "gsol_mint_authority",
    M_SOL_ACCOUNT = "msol_account",
}

export type GreenStakeConfig = {
    stateAddress: PublicKey,
    gsolMint: PublicKey,
    treasury: PublicKey,
    programId: PublicKey,
}

const findProgramDerivedAddress = (config: GreenStakeConfig, seed: ProgramDerivedAddressSeed, extraSeeds: Buffer[] = []): [PublicKey, number] => {
    const seeds = [config.stateAddress.toBuffer(), Buffer.from(seed), ...extraSeeds]
    return PublicKey.findProgramAddressSync(seeds, config.programId)
}

export const findMSolTokenAccountAuthority = (
    config: GreenStakeConfig,
    authority: PublicKey,
): [PublicKey, number] => findProgramDerivedAddress(config, ProgramDerivedAddressSeed.M_SOL_ACCOUNT, [authority.toBuffer()]);

export const findGSolMintAuthority = (config: GreenStakeConfig): [PublicKey, number] => findProgramDerivedAddress(config, ProgramDerivedAddressSeed.G_SOL_MINT_AUTHORITY)

export const logKeys = (transaction: Transaction) =>
    transaction.instructions.forEach((instruction, j) => {
        instruction.keys.forEach((key, i) => {
            console.log(j, i, key.pubkey.toBase58());
        })
    })

export const confirm = (connection: Connection) =>
    async (txSig: string) =>
        connection.confirmTransaction({signature: txSig, ...(await connection.getLatestBlockhash())})