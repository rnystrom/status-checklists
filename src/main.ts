import * as core from '@actions/core'
import * as github from '@actions/github'
import {findChecklists, ChecklistResult} from './utility'

function setOutput(result: ChecklistResult) {
  if (result.open == 0 && result.closed > 0) {
    core.setOutput('checklist_status', 'closed')
  } else if (result.open > 0 && result.closed > 0) {
    core.setOutput('checklist_status', 'in_progress')
  } else if (result.open > 0 && result.closed == 0) {
    core.setOutput('checklist_status', 'open')
  }
}

async function run(): Promise<void> {
  try {
    // get the issue
    const issue = github.context.payload.issue
    if (!issue) {
      core.setFailed("No issue found on Actions context")
      return
    }

    const checklistResult = findChecklists(issue.body ?? '')
    if (checklistResult.open === 0 && checklistResult.closed === 0) {
      console.log('No checklists found, bailing')
      core.setOutput('checklist_status', 'no_checklists')
      return
    }

    const statusOpen = checklistResult.open > 0
    const issueIsOpen = issue.state === 'open'

    setOutput(checklistResult)

    if (statusOpen === issueIsOpen) {
      console.log('Issue status unchanged, bailing')
      return
    }

    // get the token
    const token = core.getInput('github_token')
    if (!token || token.length === 0) {
      core.setFailed('Missing required github_token input')
      return
    }

    const client = new github.GitHub(token);

    console.log(`Setting issue status to ${statusOpen ? 'open' : 'closed'}...`)
    await client.issues.update({
      owner: github.context.payload.repository?.owner.login ?? '',
      repo: github.context.payload.repository?.name ?? '',
      issue_number: issue.number,
      state: statusOpen ? 'open' : 'closed'
    })
    console.log(`Issue updated`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
