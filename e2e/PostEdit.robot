*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login   username=crewmate   password=password
Test Setup      Go To   http://localhost:3000/s/SampleStation
Suite Teardown   Close Browser
*** Variables ***

*** Test Cases ***
8.1 Invalid edit post (empty post text)
    [documentation]  Test if editing the post content allows blank content
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible   css:.dropdown-toggle
    ${title} =  Get Text    css:.post-title
    Click Element   css:.dropdown-toggle
    Wait Until Element Is Visible   id:edit-post-button
    Click Element   id:edit-post-button
    Wait Until Element Is Visible   id:title
    Input Text              id:title    Fine day
    #Capture Page Screenshot
    #Click Element           id:text
    #Clear Element Text      id:text
    Input Text              id:text    ${SPACE}
    #Textarea Value Should Be    id:text     ${EMPTY}
    #Capture Page Screenshot
    Click Element   id:submit
    #Capture Page Screenshot
    Page Should Contain Element     class:error
    Page Should Contain    Post text is required
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains    ${title}

8.2 Invalid edit post (empty post title)
    [documentation]  Test if editing the post allows blank title 
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible   css:.dropdown-toggle
    ${title} =  Get Text    css:.post-title
    Click Element   css:.dropdown-toggle
    Wait Until Element Is Visible   id:edit-post-button
    Click Element   id:edit-post-button
    Wait Until Element Is Visible   id:title
    Click Element           id:title
    Clear Element Text      id:title
    Input Text              id:title    ${SPACE}
    #Textfield Value Should Be    id:title     ${EMPTY}
    #Capture Page Screenshot
    Input Text              id:text     Out here!
    #Capture Page Screenshot
    Click Element   id:submit
    #Capture Page Screenshot
    Page Should Contain Element     class:error
    Page Should Contain        Post title is required
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains    ${title}

8.3 Valid edit post
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible   css:.dropdown-toggle
    ${title} =  Get Text    css:.post-title
    Click Element   css:.dropdown-toggle
    Wait Until Element Is Visible   id:edit-post-button
    Click Element   id:edit-post-button
    Wait Until Element Is Visible   id:title
    Input Text  id:title    Fine day
    Input Text  id:text     Out here!
    Click Element   id:submit
    Wait Until Page Contains    Fine day
    Wait Until Page Contains    Out here!
*** Keywords ***
