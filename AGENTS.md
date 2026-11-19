# Website instructions

## Context tooltips

- Add a tooltip when it gives visitors useful context about a portfolio item or an unfamiliar term. Use the existing navigation tooltip style and show it on hover or keyboard focus. Keep the page free of extra labels and icons.
- Follow references to the original material. If a search turns up only a headline, newsletter mention, or excerpt, keep looking for the full article, deck, recording, or report. If the original link is unavailable, check archived copies and the author’s own materials. For Featured In, read the coverage too, so you can verify what the outlet featured and how it credited nisedo. If you still lack enough context, skip the tooltip.
- Read the full source before writing. For a talk, review the full slide deck or recording. For an article, read the full piece. For an audit, read the public report’s scope or use public project documentation. Summarize the item as a whole. A concrete example should illustrate the overall scope without making one section, the opening slides, or a single technique sound like the entire subject.
- Write in the first person when describing nisedo’s work or role. Use “I was a guest,” “I moderated,” “I reviewed,” or “I wrote” where relevant. Use “we” for joint work and plain language for definitions. Describe the role the source supports.
- Tailor the tooltip to the section and rewrite it when the same work appears on more than one page.
  - **Home and About** have no content tooltips. The navigation tooltips still name their destinations.
  - In **Audit Portfolio**, start with “I reviewed” and name the publicly documented component or scope. Give a concrete detail about what it does. When only the broader project is documented, say “I reviewed part of [project]” or “I reviewed a component of [project],” then explain what the project does using public information. Include collaborators when useful and supported. Example: “I reviewed the contracts that handle ticket purchases and accounting for Arbitrum’s premium sequencer feed.”
  - In **Bug Bounties**, use a consistent project description grounded in public documentation. Example: “Ammalgam combines token swaps and lending in the same liquidity pools.”
  - In **Talks**, summarize the full talk and its main takeaways in the first person.
  - In **Podcasts & Webinars**, state nisedo’s role and summarize the conversation as a whole. Use the recording or detailed episode notes. Example: “I moderated a panel on how DeFi teams make automation easier to use while keeping automated transactions safe.”
  - In **Writing**, summarize what the full piece covers and what a reader can take away. Example: “I compared Solidity’s runtime checks with Sui Move’s type guarantees, using DeepBook to show how a flash loan must be repaid within the transaction.”
  - In **Featured In**, explain what the outlet highlighted, republished, or credited. Give enough subject detail to identify the work. Example: “In ADAN’s member newsletter, iExec named me as a Soliditors speaker in its recap of the first Lyon iMeet on smart contract security.”
  - In **Tools & Open Source**, explain what the tool helps someone do and when they’d use it. Example: “I built Flowther to help reviewers trace an unfamiliar Solidity function through its calls to the state it can change.”
- Keep each tooltip to one concise sentence where possible. Skip it if all it would do is repeat the title or metadata, recite the outlet names already shown, or explain where a link goes.
- Verify the details against reliable sources. For audits and bug bounties, use only publicly available information. When the exact review scope or finding is private, use a useful public project description if one is available. Skip the tooltip only when you cannot verify enough public context to make it useful.
- When adding a new item, explicitly tell the user if it has no tooltip, whatever the reason. Name the item and explain why the tooltip was omitted. If a source or detail would make it possible to add one, say what is needed.

Approved example for “AI-Native Auditing in Five Minutes”

> I shared five techniques for AI-assisted audits, from setting a threat model and scoping reviews to comparing models, reassessing findings, and checking what code agents actually read.
