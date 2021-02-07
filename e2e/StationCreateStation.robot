*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login   username=crewmate   password=password
Test Setup      Click Element   id:create-station
Suite Teardown   Close Browser
*** Variables ***

*** Test Cases ***
6.1 Successful Create Station
    Wait Until Page Contains Element  id:name
    Input Text  id:name     StationQA
    Input Text  id:description  desc
    Input Text  id:rules        rule
    Click Element   id:create
    Wait Until Page Contains Element  id:station-rules
    Location Should Be  http://localhost:3000/s/StationQA

6.2 Station Name Already in Use
    Wait Until Page Contains Element  id:name
    Input Text  id:name     SampleStation
    Input Text  id:description  desc
    Input Text  id:rules        rule
    Click Element   id:create
    Wait Until Page Contains Element    css:.form-group:nth-child(4)>.error
    Element Text Should Be  css:.form-group:nth-child(4)>.error  Station name is already used
    
6.3 Station Name Too Short
    Wait Until Page Contains Element  id:name
    Input Text  id:name     sa
    Input Text  id:description  desc
    Input Text  id:rules        rule
    Click Element   id:create
    Wait Until Page Contains Element     css:.form-group:nth-child(4)>.error
    Element Text Should Be  css:.form-group:nth-child(4)>.error  Station name is too short (min 3)
*** Keywords ***
