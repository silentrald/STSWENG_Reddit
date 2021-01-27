*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login   username=captain2   password=password
*** Variables ***

*** Test Cases ***
9.1 Post deletion canceled
    Go To   http://localhost:3000/s/SampleStation2
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible   css:.dropdown-toggle
    ${title} =  Get Text    css:.post-title
    Click Element   css:.dropdown-toggle
    Wait Until Element Is Visible   id:delete-post-button
    Click Element   id:delete-post-button
    Wait Until Element Is Visible   css:.btn-secondary
    Click Element   css:.btn-secondary
    Page Should Contain Element     css:.post-title
    Page Should Contain    ${title}
    Go To   http://localhost:3000/s/SampleStation2
    Wait Until Page Contains    ${title}

9.2 Post deletion confirmed
    Go To   http://localhost:3000/s/SampleStation2
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible  css:.dropdown-toggle
    ${title} =  Get Text    css:.post-title
    Click Element   css:.dropdown-toggle
    Wait Until Element Is Visible  id:delete-post-button
    Click Element   id:delete-post-button
    Wait Until Element Is Visible  css:.btn-outline-danger
    Click Element   css:.btn-outline-danger
    Wait Until Page Contains     Post has successfully been deleted.
    Go To   http://localhost:3000/s/SampleStation2
    Wait Until Page Does Not Contain    ${title}
*** Keywords ***
