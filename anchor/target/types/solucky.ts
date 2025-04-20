/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solucky.json`.
 */
export type Solucky = {
  "address": "2JwsoU5RL9MpQvyaydghZfx32ijo49HiLMJAfutPMSEg",
  "metadata": {
    "name": "solucky",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "lottery",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "configuration",
      "discriminator": [
        192,
        79,
        172,
        30,
        21,
        173,
        25,
        43
      ]
    }
  ],
  "types": [
    {
      "name": "configuration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "winner",
            "type": "u64"
          },
          {
            "name": "winnerClaimed",
            "type": "bool"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "totalTickets",
            "type": "u64"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "randomnessAccount",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
