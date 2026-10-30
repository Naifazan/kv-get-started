export async function onRequestPost(context) {
  try {
    const {
      orgName,
      projectTitle,
      fundingAmount,
      grantType,
      projectDesc,
      beneficiaries,
      additionalInfo,
    } = await context.request.json();

    const prompt = `You are a professional grant writer with 20 years of experience. Write a complete, compelling grant proposal based on the following information:

Organization Name: ${orgName}
Project Title: ${projectTitle}
Funding Amount Requested: ${fundingAmount}
Grant Type: ${grantType}
Project Description: ${projectDesc}
Target Beneficiaries: ${beneficiaries || "Not specified"}
Additional Details: ${additionalInfo || "None provided"}

Please write a full grant proposal that includes:
1. Executive Summary
2. Statement of Need
3. Project Description (objectives, methodology, timeline)
4. Goals and Outcomes
5. Target Population and Beneficiaries
6. Budget Justification
7. Sustainability Plan
8. Organization Capacity
9. Evaluation Plan

Write in a professional, persuasive tone. Be specific and detailed. Format with clear section headers.`;

    const aiResponse = await context.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: "You are an expert grant writer. You write professional, compelling grant proposals that are well-structured and persuasive. Always format your proposals with clear section headers and detailed content." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
      }
    );

    return Response.json({ proposal: aiResponse.response });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
