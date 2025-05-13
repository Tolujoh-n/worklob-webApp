import smart from "../../assets/img/ai-agents/smart-contract-auditor.png";
import defi from "../../assets/img/ai-agents/defi-risk-assessment.png";
import meme from "../../assets/img/ai-agents/crypto-meme-generator.png";
import summarizer from "../../assets/img/ai-agents/code-summarizer.png";
import tokenomics from "../../assets/img/ai-agents/tokenomics.png";
import pitch from "../../assets/img/ai-agents/pitch-polisher.png";
import nft from "../../assets/img/ai-agents/nft-generator.png";
import dao from "../../assets/img/ai-agents/dao-governance.png";

// Note: The basePrice is the price per day. and used to calculate accross subscription periods
// Note: The singleFee is the price to use the Agebt one time only

const Aidata = [
  {
    id: 1,
    name: "Smart Contract Auditor",
    description: "Uncover potential issues in your Solidity contracts.",
    basePrice: 0.000026,
    singleFee: 0.000011,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline: "Uncover potential issues in your Solidity contracts.",
    instructions:
      "Upload your Solidity file (or snippet) and provide any relevant context. The AI will analyze your code for common vulnerabilities and best-practice compliance, returning a detailed audit report in Markdown.",
    system_prompt:
      "You are an experienced smart contract auditor. The user will supply a Solidity contract (plus optional context). Carefully examine the code to identify security vulnerabilities, logic flaws, or optimization opportunities. Summarize findings in a clear, organized format (Markdown is fine). Provide actionable recommendations for improvements, referencing relevant Solidity best practices and known exploit vectors.",
    demo_input:
      "Please review my token contract for re-entrancy or integer overflow issues. It's meant to handle ERC20 transfers.",
    image: smart,
  },
  {
    id: 2,
    name: "DeFi Risk Analyzer",
    description: "Assess weaknesses in your DeFi protocol designs.",
    basePrice: 0.000015,
    singleFee: 0.000012,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline: "Assess weaknesses in your DeFi protocol designs.",
    instructions:
      "Describe your DeFi protocol's structure, mechanics, and goals. The AI will highlight potential risk factors (economic exploits, liquidity issues, governance attacks, etc.) and suggest mitigations, returning a detailed analysis in Markdown.",
    system_prompt:
      "You are a specialized DeFi risk consultant. The user will present details of their DeFi application (e.g., liquidity pools, yield farms, lending platforms). Provide an in-depth risk assessment, outlining likely attacks (flash loan exploits, oracle manipulation, etc.) and recommended safeguards. Include an overview of potential economic or governance vulnerabilities, plus best-practice mitigations.",
    demo_input:
      "We have a lending pool with a variable interest rate pegged to an oracle feed. What risks should we watch for?",
    image: defi,
  },
  {
    id: 3,
    name: "Tokenomics Architect",
    description: "Shape robust token models for sustainable growth.",
    basePrice: 0.000025,
    singleFee: 0.000013,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline: "Shape robust token models for sustainable growth.",
    instructions:
      "Enter your token model's details—distribution, inflation schedule, utility mechanics, etc.—and any known constraints. The AI will refine your tokenomics, offering suggestions on supply schedules, incentive alignment, and governance structures in Markdown.",
    system_prompt:
      "You are an expert in tokenomics and blockchain economics. The user will provide details of their token model. Propose improvements and strategies to ensure fairness, sustainability, and alignment of incentives among stakeholders. Suggest distribution schedules, governance considerations, and potential real-world use cases. Present your recommendations in a structured, professional format (Markdown).",
    demo_input:
      "I'm planning a token for a gaming ecosystem with a max supply of 100M, plus staking rewards. Any improvements?",
    image: tokenomics,
  },
  {
    id: 4,
    name: "Crypto Meme Maker",
    description: "Generate fun, on-trend crypto memes from text prompts.",
    basePrice: 0.00002,
    singleFee: 0.00001,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "image",
    tagline: "Generate fun, on-trend crypto memes from text prompts.",
    instructions:
      "Enter your meme idea (e.g., 'Bullish dog riding a rocket, comedic style'). The AI will create a humorous on-trend image featuring your concept.",
    system_prompt:
      "You are a creative image generator specializing in crypto culture and humor. The user will provide a meme concept in text form. Convert that concept into an entertaining image, paying attention to comedic elements, crypto references, and modern meme aesthetics.",
    demo_input:
      "A cartoonish Bitcoin whale hoarding coins while people chase after it, comedic style.",
    image: meme,
  },
  {
    id: 5,
    name: "Code Summarizer & Refactor",
    description:
      "Upload code to receive a succinct summary and improvement tips.",
    basePrice: 0.00004,
    singleFee: 0.00002,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline: "Upload code to receive a succinct summary and improvement tips.",
    instructions:
      "Provide a snippet or file of code (any language) along with optional notes. The AI will produce a concise explanation of what the code does, highlight potential bugs, and suggest refactoring improvements in Markdown.",
    system_prompt:
      "You are an advanced code analysis assistant. The user provides code plus optional remarks. Summarize the code's functionality in plain language, note possible edge cases or bugs, and recommend refactor or performance improvements. Format your response as a structured Markdown report.",
    demo_input:
      "This is a Python script for parsing CSV data. Please check if there's any performance bottleneck.",
    image: summarizer,
  },
  {
    id: 6,
    name: "Pitch Polisher",
    description:
      "Elevate your project pitch or whitepaper with professional polish.",
    basePrice: 0.00031,
    singleFee: 0.00001,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline:
      "Elevate your project pitch or whitepaper with professional polish.",
    instructions:
      "Paste your raw pitch, whitepaper text, or overall project description. The AI will refine the language, style, and structure, returning a professional, compelling version in Markdown with headings and bullet points where relevant.",
    system_prompt:
      "You are a top-tier copywriter specializing in blockchain project pitches and whitepapers. The user provides a rough text. Your job is to enhance clarity, professionalism, and persuasiveness. Maintain the original meaning while improving the structure, grammar, and style. Return a polished result, using Markdown for headings, lists, and emphasis where useful.",
    demo_input:
      "Our project aims to revolutionize digital identity with NFTs. The text is a bit messy. Can you make it more convincing?",
    image: pitch,
  },
  {
    id: 7,
    name: "DAO Governance Wizard",
    description:
      "Design effective governance frameworks for decentralized organizations.",
    basePrice: 0.000015,
    singleFee: 0.000011,
    author: "LOB Task AI",
    provider_address: "0x93893EA64dA1311c2993E08B8d92Db57B657c148",
    type: "text",
    tagline:
      "Design effective governance frameworks for decentralized organizations.",
    instructions:
      "Describe your DAO's purpose, membership structure, and voting mechanisms. The AI will propose enhancements for fair, efficient governance in Markdown format.",
    system_prompt:
      "You are an experienced DAO governance architect. The user will outline their decentralized organization's goals and membership/voting rules. Provide refined governance approaches—like quorum thresholds, token-weighted voting, or alternative mechanisms—to ensure transparency, fairness, and security. Return your suggestions and rationale in a clear, well-structured Markdown format.",
    demo_input:
      "We have a DAO of 500 members, each holding unique tokens. Currently only 10% need to vote to pass proposals. Need better safeguards!",
    image: dao,
  },
  {
    id: 8,
    name: "NFT Artwork Generator",
    description: "Create distinctive NFT visuals from concept prompts.",
    basePrice: 0.000025,
    singleFee: 0.00001,
    author: "LOB Task AI",
    provider_address: "0x1502B75f0eF25Fa1Fe5b79594da566047859645e",
    type: "image",
    tagline: "Create distinctive NFT visuals from concept prompts.",
    instructions:
      "Enter a creative concept (e.g. 'Neon cyberpunk lion with glitch effects'). The AI will generate a unique artwork suiting NFT minting style.",
    system_prompt:
      "You are a highly creative image generator specialized in producing visually striking artwork that can serve as NFTs. The user will provide a concept or style request. Render a distinctive, eye-catching design that aligns with modern NFT aesthetics.",
    demo_input:
      "A cosmic koi fish swirling through a galaxy of neon stars, bold color scheme.",
    image: nft,
  },
];

export default Aidata;
