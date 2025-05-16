chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyJobInfo
  });
});

function copyJobInfo() {

  const url = new URL(window.location.href)
  const params = url.searchParams
  const isJobListPage = params.has("currentJobId")
  
  const company = document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.textContent.trim()
  const jobLocation = document.querySelector(".job-details-jobs-unified-top-card__tertiary-description-container span")?.children[0]?.textContent.trim()
  const jobTitle = isJobListPage
    ? document.querySelector(".job-details-jobs-unified-top-card__job-title h1 a")?.textContent.trim()
    : document.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.textContent.trim()
  const jobUrl = isJobListPage
    ? `https://www.linkedin.com/jobs/view/${params.get("currentJobId")}`
    : url.origin + url.pathname

  const fields = [company, jobLocation, jobTitle, jobUrl]
  const hasInvalidField = fields.some(field => field === undefined || field === null || field === "")
  if (hasInvalidField) {
    alert("🥲 Some required information is missing.")
    return
  }

  const result = `${company}\t${jobLocation}\t${jobTitle}\t${jobUrl}`

  const successMsg = isJobListPage
    ? "🧐 Copied from Job List Page!"
    : "🧐 Copied from Job Detail Page!"

  if (document.hasFocus()) {
    navigator.clipboard.writeText(result).then(() => {
      alert(successMsg)
    }).catch(err => {
      console.error("Failed to copy: ", err)
      alert("🥲 Failed to copy.")
    })
  } else {
    alert("Please click anywhere on the page first, then try again.");
  }

}
