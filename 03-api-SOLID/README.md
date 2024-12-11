# App

Gympass style app


## Functional requirements

- [x] it should be possible to register itself
- [x] it should be possible to authenticate itself
- [x] it should be possible to get the profile of a logged in user
- [ ] it should be possible to get the check-ins number of a logged in user
- [ ] it should be possible the user gets his check-in history
- [ ] it should be possible the user gets nearby gyms
- [ ] it should be possible the user gets gyms by name
- [ ] it should be possible the user make check-in in a gym
- [ ] it should be possible to validate the check-in of an user
- [ ] it should be possible to register a gym


## Business rules

- [x] user can't register with a duplicated email
- [ ] user can't do 2 check-ins in the same day
- [ ] user can't do check-in if he isn't near (100m) from the gym
- [ ] the check-in can only be validated up to 20 minutes after creation
- [ ] the check-in can only be validated by admins
- [ ] gym can only be registered by admins


## Non functional requirements

- [x] the user password must be encrypted
- [ ] the app data must be in a PostgreSQL db
- [ ] all data lists must be paginated with 20 items per page
- [ ] user must be identified by a JWT (Json Web Token)