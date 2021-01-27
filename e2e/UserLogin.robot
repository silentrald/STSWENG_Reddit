*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot

*** Variables ***

*** Test Cases ***
2.1 Login Fail - Invalid Credentials
    [documentation]  User Login/Logout

    Open Chrome
    Click Element  id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  SonGoku
    Input Text  id:password  baloney1
    Click Element  xpath://html/body/div/div/div/div/div/form/button
    Wait Until Page Contains Element  class:error
    Element Text Should be  class:error  Invalid Credentials
    Close Browser

2.2 Login Success - Valid Credentials
    [documentation]  User Login/Logout

    Open Chrome
    Click Element  id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:password  password
    Click Element  xpath://html/body/div/div/div/div/div/form/button
    Wait Until Page Contains Element  xpath://a/div
    Page Should Contain  /username

2.3 Logout
    Click Element  id:logout
    Reload Page
    # Page Should Not Contain  /username
    Page Should Contain Element  id:login
    Close Browser
*** Keywords ***
