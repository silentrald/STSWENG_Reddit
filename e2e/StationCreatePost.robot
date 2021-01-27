*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login
Test Setup      Join Station    station=SampleStation2
Test Teardown   Leave Station   station=SampleStation2
*** Variables ***

*** Test Cases ***
7.1 Invalid Add Post (Empty Title)
    Wait Until Page Contains Element  id:add-post
    Click Element   id:add-post
    Wait Until Page Contains Element  id:text
    Input Text  id:text     Hello!
    Click Element   id:submit
    Wait Until Page Contains     Post title is required

7.2 Invalid Add Post (Empty Post Body)
    Wait Until Page Contains Element  id:add-post
    Click Element   id:add-post
    Wait Until Page Contains Element  id:title
    Input Text  id:title     Hello world!
    Click Element   id:submit
    Wait Until Page Contains     Post text is required
    
7.3 Valid Add Post
    Wait Until Page Contains Element  id:add-post
    Click Element   id:add-post
    Wait Until Page Contains Element  id:title
    Input Text  id:title     Hello world!
    Input Text  id:text     Programmed to work and not to feel
    Click Element   id:submit
    Wait Until Page Contains Element  id:station-rules
    Location Should Be  http://localhost:3000/s/SampleStation2
    Element Text Should Be     css:.post:nth-child(1) .post-title       Hello world!
    Element Text Should Be     css:.post:nth-child(1) .post-preview     Programmed to work and not to feel
*** Keywords ***
