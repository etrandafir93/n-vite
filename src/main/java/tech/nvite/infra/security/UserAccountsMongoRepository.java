package tech.nvite.infra.security;

import org.springframework.data.mongodb.repository.MongoRepository;

interface UserAccountsMongoRepository extends MongoRepository<UserAccount, String> {}
