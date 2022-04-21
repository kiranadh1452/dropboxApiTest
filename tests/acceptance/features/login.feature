Feature: login

    As a user
    I want to login to my joomla account
    So that only I can access my account

    Scenario: Login with valid credentials

      Given the user has browsed to login page 
      When the user enters username 'kiranadh' and password 'kiran1234'
      Then the user should see ' Control Panel' heading

    Scenario: Login with invalid credentials

      Given the user has browsed to login page 
      When the user enters username 'kiranadh12' and password 'ahsjahas'
      Then the user should see 'Username and password do not match or you do not have an account yet.' error message


