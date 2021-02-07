*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup  Open Chrome
Suite Teardown   Close Browser

*** Variables ***

*** Test Cases ***
2.1 Login Fail - Invalid Credentials
    [documentation]  Test if login fails if the username is not registered in the database
    
    Click Element  id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  SonGoku
    Input Text  id:password  baloney1
    Click Element  xpath://html/body/div/div/div/div/div/form/button
    Wait Until Page Contains Element  class:error
    Element Text Should be  class:error  Invalid Credentials

2.2 Login Success - Valid Credentials
    [documentation]  Test if login succeeds if the username is registered in the database

    Input Text  id:username  username
    Input Text  id:password  password
    Click Element  xpath://html/body/div/div/div/div/div/form/button
    # Wait Until Page Contains Element  xpath://html/body/div/div/div/nav/div/div[2]/div/ul/li[1]/a/div  6
    Wait Until Page Contains Element  xpath://a/div 
    Page Should Contain  /username

2.3 Logout
    [documentation]  Test if logout works properly
    
    Wait Until Page Contains Element  id:logout
    Click Element  id:logout
    Reload Page
    # Page Should Not Contain  /username
    Page Should Contain Element  id:login
    

2.4 Login with a fresh registration
    [documentation]  Test if login will work for a freshly registered username

    Click Element  id:signup
    Wait Until Page Contains Element  id:username
    Input Text  id:username  Fresh_Signup
    Input Text  id:email  fresh@gmail.com
    Input Text  id:password  Password1
    Input Text  id:cpassword  Password1
    Click Element  id:submit
    Page Should Contain Element  xpath://*[@id="__layout"]/div/div/div

    Reset
    Click Element  id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  Fresh_Signup
    Input Text  id:password  Password1
    Click Element  xpath://html/body/div/div/div/div/div/form/button
    Wait Until Page Contains Element  xpath://html/body/div/div/div/nav/div/div[2]/div/ul/li[1]/a/div  6
    Page Should Contain  /Fresh_Signup
    Close Browser
    

*** Keywords ***
