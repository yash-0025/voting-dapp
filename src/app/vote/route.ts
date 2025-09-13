import { ActionGetResponse, ActionParameter, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import * as anchor from "@coral-xyz/anchor";
import {Voting} from "@/../anchor/target/types/voting";
import {PublicKey, Transaction} from "@solana/web3.js";


import idl from "@/../anchor/target/idl/voting.json";

export const OPTIONS = GET;


export async function GET(request: Request) {

    const response: ActionGetResponse = {
        icon: "https://hips.hearstapps.com/hmg-prod/images/peanut-butter-vegan-1556206811.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*",
        description: "Vote for your favorite peanut butter!",
        label: "Vote Now",
        links: {
            actions: [
                {
                    type: "external-link",
                    href : 'http://localhost:3000/vote?candidate=candidate1',
                    label: "Vote for Candidate 1",
                },
                {
                    type: "external-link",
                    href: 'http://localhost:3000/vote?candidate=candidate2',
                    label: "Vote for Candidate 2",
                }
            ],
        },
    };

    return Response.json(response, {headers: ACTIONS_CORS_HEADERS })
}

export async function POST(request: Request){
    const connection = new anchor.web3.Connection("http://127.0.0.1:8899", "confirmed");
    const program: anchor.Program<Voting> = new anchor.Program(idl as Voting, {connection});

    const url = new URL(request.url);
    const vote = url.searchParams.get("candidate") as string;

    if (vote !== 'candidate1' && vote !== 'candidate2') {
        return Response.json({error: "Invalid candidate"}, {headers: ACTIONS_CORS_HEADERS})
    }

    const body: ActionPostRequest = await request.json();
    let account : PublicKey;
    try {
        account = new PublicKey(body.account);
    } catch(error) {
        return new Response("Invalid account", {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }

    const instruction = await program.methods.vote(
        new anchor.BN(1),
        "candidate1",
    ).accounts({
        signer:account,
    }).instruction();
    
    const blockhashResponse = await connection.getLatestBlockhash();

    const tx = new Transaction({
        feePayer: account,
        blockhash: blockhashResponse.blockhash,
        lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
    
    }).add(instruction)


    const response = await createPostResponse({
        fields: {
            type: "transaction",
            transaction: tx,
        },
    })

    return Response.json(response, {headers: ACTIONS_CORS_HEADERS})


}