# Index

  - [1. Agent routes](#1-agentcontrollerts)  
    - [1.1 Get agent profile](#11-get-agent-profile)  
    - [1.2 Get agent's feedback](#12-get-agents-feedback)  
    - [1.3 Accept agent's feedback](#13-accept-agents-feedback)  
    - [1.4 Update agent's profile picture](#14-update-agents-profile-picture)  
    - [1.5 Update agent's status](#15-update-agents-status)  
---
  - [2. Authentication routes](#2-authenticationcontrollerts)  
    - [2.1 Sign up an agent](#21-sign-up-an-agent)  
    - [2.2 Sign up a manager](#22-sign-up-a-manager)  
    - [2.3 Verify an account](#23-verify-an-account)  
    - [2.4 Sign in the application](#24-sign-in-the-application)  
    - [2.5 Sign out the application](#25-sign-out-the-application)  
    - [2.6 Initialize a forgot password flow](#26-initialize-a-forgot-password-flow)  
    - [2.7 Confirm a new password](#27-confirm-a-new-password)  
    - [2.8 Get active user's email](#29-get-active-users-email)  
    - [2.9 Get all the user's signed in the application](#210-get-all-the-users-signed-in-the-application)  
---    
  - [3. Client routes](#3-clientcontrollerts)  
    - [3.1 Register a client](#31-register-a-client)  
    - [3.2 Log in a client](#32-log-in-a-client)  
---
  - [4. Key-Click Recording routes](#4-keyclickcontrollerts)  
    - [4.1 Add a keystroke done by an agent](#41-add-a-keystroke-done-by-an-agent)  
    - [4.2 Add a click done by an agent](#42-add-a-click-done-by-an-agent)  
    - [4.3 Delete all the files created by the controller](#43-delete-all-the-files-created-by-the-controller)  
---
  - [5. Manager routes](#5-managercontrollerts)  
    - [5.1 List all agents in the system and its attributes](#51-list-all-agents-in-the-system-and-its-attributes)  
    - [5.2 Get agent profile](#52-get-agent-profile)  
    - [5.3 Get manager profile](#53-get-manager-profile)  
    - [5.4 Show a specific recording](#54-show-a-specific-recording)  
    - [5.5 Show recordings of an agent](#55-show-recordings-of-an-agent)  
    - [5.6 Show recordings filtered by tags](#56-show-recordings-filtered-by-tags)  
    - [5.7 Show newest recordings](#57-show-newest-recordings)  
    - [5.8 Show newest or oldest recordings](#58-show-newest-or-oldest-recordings)  
    - [5.9 Post comments to an agent](#59-post-comments-to-an-agent)  
    - [5.10 Update manager's profile picture](#510-update-managers-profile-picture)  
---
  - [6. Third-Party-Services routes](#6-thirdpartyservicescontrollerts)  
    - [6.1 Ask for a Thirs Party Service](#61-ask-for-a-thirs-party-service)  
    - [6.2 Send Third Party Service via e-mail](#62-send-third-party-service-via-e-mail)  
---
  - [7. User Configuration routes](#7-userconfigurationsts)  
    - [7.1 Get user's configuration](#71-get-users-configuration)  
    - [7.2 Update user's configuration](#72-update-users-configuration)  

# 1. AgentController.ts
  ## 1.1 Get agent profile
  
  This route lets you get all the data of a specific agent.
  
  - **Endpoint**: `/agent/agentProfile`
  - **Method**: `GET`
  - **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backtest.bannkonect.link/agent/agentProfile?email=agent@bankonnect.link`  

  - **Validations**: _No body validation needed_. 
    | Field                    | Validation                         |
    | ------------------------ | ---------------------------------- |
    | Access token             | Required                           |
    | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
      "agent_id": "asdasd-1323-asdgg-3f-3df4",
      "super_id": "lkjk3m3kl-3-342342fds-32fdsfwl",
      "name":  "Agent's name",
      "password": "MyP4ssw0rD!",
      "email": "agent@bankonnect.link",
      "profile_picture": "https://profile.com/picture.png",
      "rating" 4.8,
      "status": "Active",
      "calls": 90
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
## 1.2 Get agent's feedback
  This route lets you get all the feedback an agent has received.
  
  - **Endpoint**: `/agent/getFeedback`
  - **Method**: `GET`
  - **Body**: Doesn't receive a body because of `GET` method but receives a query parameter like this: `https://backtest.bankonnect.link/agent/getFeedback?email=agent@bankonnect.link`  

  - **Validations**: _No body validation needed_. 

    | Field                    | Validation                         |
    | ------------------------ | ---------------------------------- |
    | Access token             | Required                           |
    | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`

    ```json
    {
      "agent_name": "name@server.com",
      "agent_email": "MYP4sw4rd$",
      "comments": [
        {
          "comment_id": 203492,
          "super_id": "0asodsajdhda-213eqsdas-31231dsaa-aseds",
          "comment": "You can improve.",
          "rating": 3,
          "date": "2022-06-06 15:13:56"
        },
        {
          "comment_id": 203493,
          "super_id": "089alksajd80-2dasd22sdas-3dqweopaa-a331ds",
          "comment": "You are great!",
          "rating": 5,
          "date": "2022-06-07 20:01:17"
        }
      ]
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
  ## 1.3 Accept agent's feedback
 - **Endpoint**: `/agent/acceptFeedback`
  - **Method**: `POST`
  - **Body**: 
    ```json
    {
      "comment_id": "The id of the comment"
    }
    ```
  - **Validations**:
    - **Body validations**
      | Field      | Validation                  |
      | ---------- | --------------------------- |
      | comment_id | Comment ID must be a string |
    - **Other validations** 
      | Field                    | Validation                         |
      | ------------------------ | ---------------------------------- |
      | Access token             | Required                           |
      | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
     "message": "Comment 123 has been updated"
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```

  ## 1.4 Update agent's profile picture
  - **Endpoint**: `/agent/updateProfilePicture`
  - **Method**: `POST`
  - **Body**: 
    ```json
    {
      "user_email": "agent@bamkonnect.link",
      "profile_picture": "http://pp.link/new_pic.png"
    }
    ```
  - **Validations**:
    - **Body validations**:
      | Field           | Validation            |
      | --------------- | --------------------- |
      | user_email      | Must be a valid email |
      | profile_picture | Must be a string      |
    - **Other validations**:
      | Field                    | Validation                         |
      | ------------------------ | ---------------------------------- |
      | Access token             | Required                           |
      | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
     "message": "Profile picture updated"
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
  ## 1.5 Update agent's status
  - **Endpoint**: `/agent/updateStatus`
  - **Method**: `POST`
  - **Body**: 
    ```json
    {
      "agent_id": "8sahdkqwlda-139lfkmslfs-232l-o80sdf",
      "status": "agent status" //Could be Active, Inactive or In-Call
    }
    ```
  - **Validations**: _No body validation needed_.
    | Field                    | Validation                         |
    | ------------------------ | ---------------------------------- |
    | Access token             | Required                           |
    | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
     "message": "Agent status updated"
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
# 2. AuthenticationController.ts
  ## 2.1 Sign up an agent
  ## 2.2 Sign up a manager
  ## 2.3 Verify an account
  ## 2.4 Sign in the application
  ## 2.5 Sign out the application
  ## 2.6 Initialize a forgot password flow
  ## 2.7 Confirm a new password
  ## 2.8 Get active user's email
  ## 2.9 Get all the user's signed in the application

# 3. ClientController.ts
  ## 3.1 Register a client 
  - **Endpoint**: `/client/clientLogin`
  - **Method**: `POST`
  - **Body**: 
    ```json
    {
      "client_name": "Client name",
      "password": "My_P4ssw0rD!",
      "email": "client@email.com",
      "phone_number": "+525516768922",
      "client_pin": "3312"
    }
    ```
  - **Validations**:
    - **Body validations:**
        | Field        | Validation                               |
        | ------------ | ---------------------------------------- |
        | client_name  | Must be a string                         |
        | client_name  | Must be between 2 and 40 characters long |
        | password     | Password must be a string                |
        | password     | Must be at least 8 characters long       |
        | email        | Must be a valid email                    |
        | phone_number | Must be a string                         |
        | phone_number | Must be a valid phone number             |
        | client_pin   | Must be a string                         |
        | client_pin   | Pin must be only 4 characters long       |
    - **Other validations:**
      | Field                    | Validation                         |
      | ------------------------ | ---------------------------------- |
      | Access token             | Required                           |
      | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
     "message": "Agent status updated"
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
  ## 3.2 Log in a client
  - **Endpoint**: `/agent/updateStatus`
  - **Method**: `POST`
  - **Body**: 
    ```json
    {
      "agent_id": "8sahdkqwlda-139lfkmslfs-232l-o80sdf",
      "status": "agent status" //Could be Active, Inactive or In-Call
    }
    ```
  - **Validations**: _No body validation needed_.
    | Field                    | Validation                         |
    | ------------------------ | ---------------------------------- |
    | Access token             | Required                           |
    | Administrator privileges | No administrator privileges needed |

  - **Errors**:
    | Code                     | Message                                        | Http |
    | ------------------------ | ---------------------------------------------- | ---- |
    | UsernameExistsException  | An account with the given email already exists | 500  |
    | InvalidPasswordException | Password did not conform with policy           | 500  |
    | NoTokenFound             | The token is not present in the request        | 500  |

  - **Response**: `HTTP status 200`
    ```json
    {
     "message": "Agent status updated"
    }
    ```
  - **If an error occurs**: `HTTP status 500`

    ```json
    {
      "code": "Error code",
      "message": "Error message"
    }
    ```
# 4. KeyClickController.ts
  ## 4.1 Add a keystroke done by an agent
  ## 4.2 Add a click done by an agent
  ## 4.3 Delete all the files created by the controller

# 5. ManagerController.ts
  ## 5.1 List all agents in the system and its attributes
  ## 5.2 Get agent profile
  ## 5.3 Get manager profile
  ## 5.4 Show a specific recording 
  ## 5.5 Show recordings of an agent
  ## 5.6 Show recordings filtered by tags
  ## 5.7 Show newest recordings
  ## 5.8 Show newest or oldest recordings
  ## 5.9 Post comments to an agent
  ## 5.10 Update manager's profile picture

# 6. ThirdPartyServicesController.ts
  ## 6.1 Ask for a Third Party Service
  ## 6.2 Send Third Party Service via e-mail

# 7. UserConfigurations.ts
  ## 7.1 Get user's configuration
  ## 7.2 Update user's configuration