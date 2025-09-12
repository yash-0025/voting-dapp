import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
// import '@solana/web3js'
import { Voting } from '../target/types/voting'
import { PublicKey } from '@solana/web3.js'

describe('voting', () => {

    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.Voting as Program<Voting>

    it('Initialize Poll', async() => {
        const [pollAddress] = PublicKey.findProgramAddressSync([Buffer.from('poll'), new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], program.programId
    );

    const tx = await program.methods.initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(1789194183),
        "test-poll",
        "description of the poll",
    )
    .rpc();
    console.log("Your transaction signature", tx);
    })

    it('Initialize Candidate', async() => {
        const pollIdBuffer = new anchor.BN(1).toArrayLike(Buffer, 
            'le',
            8
        )

        const [pollAddress] = PublicKey.findProgramAddressSync([Buffer.from('poll'), pollIdBuffer], program.programId);

        const candidateOne = await program.methods.initializeCandidate(
          new anchor.BN(1),
          "candidate-one",
        ).accounts({
            pollAccount: pollAddress
        })
        .rpc()

        const candidateTwo = await program.methods.initializeCandidate(
          new anchor.BN(1),
          "candidate-two",
        ).accounts({
            pollAccount: pollAddress
        })
        .rpc()

        console.log("Your Transaction signature", candidateOne)
        console.log("Your Transaction signature", candidateTwo)
    })

    it('Vote', async() => {
        const tx = await program.methods.vote(
            new anchor.BN(1), 
            "candidate-one"
        )
        .rpc();

        console.log('Your Transaction Signature', tx);
    })
})