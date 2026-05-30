# AGENTS.md - ApuntAr Backend Guide for AI Coding Agents

## Project Overview
**ApuntAr** is a Spring Boot application (Kotlin + Spring 4.0.6) for managing educational materials with user authentication, file/video storage, and interaction tracking. Dual database architecture: PostgreSQL (relational) + MongoDB (interactions).

---

## Architecture & Data Flow

### Core Layering Pattern
```
Controller (@RestController) 
  → Service (interface + Impl)
    → Repository (abstraction over DAOs)
      → DAO (@JpaRepository/@MongoRepository) + Entity
```

**Key pattern**: Repositories are abstractions; DAOs directly extend Spring repositories. See `persistence/repository/` vs `persistence/dao/`.

### Dual Database Strategy
- **PostgreSQL** (primary): Users, Materials, Files/Videos (relational, via `@Entity` + JPA)
- **MongoDB** (secondary): Interactions (Comments, Reactions) - faster queries
- Both initialized via Docker Compose with health checks; volumes persist data

### Entity Structure
- **User** (`model/User.kt`): UUID primary key, email validation in constructor, encrypted password
- **MaterialSQL** (`persistence/entity/MaterialSQL.kt`): Long auto-generated ID (SQL), includes nested relationships (files, videos)
- **Interaction** (MongoDB): Comments and Reactions stored as separate collections

---

## DTO & Model Conversion Pattern

Controllers receive `*ReqDto` (request) and return `*Dto` (response). Conversion uses extension functions (`toDto()`, `asModel()`):

```kotlin
// Controller example (UserController.kt)
fun register(@RequestBody user: RegisterReqDto): UserDto = 
  service.register(user.asModel()).toDto()
```

**Sensitive fields** are excluded via Jackson property inclusion: `@JsonIgnore` or `spring.jackson.default-property-inclusion=non_null` removes null fields to hide secrets (e.g., password never in DTOs).

---

## Authentication & Security

### JWT Flow
1. **Token generation**: `JwtUtil.generateToken(email)` creates HS256 token with 24h expiration (86400000ms)
2. **Token validation**: Secret from `jwt.secret` env var (default in `application.properties`)
3. **Request filtering**: `JwtAuthFilter` extracts Bearer token from `Authorization` header
4. **Principal extraction**: `CustomUserDetailsService` loads User by email from DB
5. **Endpoint security**: `@GetMapping("/me")` requires authenticated principal; no token = 403

**Key files**:
- `security/JwtUtil.kt`: Token generation/validation
- `security/JwtAuthFilter.kt`: HTTP request filter
- `security/CustomUserDetailsService.kt`: User lookup
- `config/SecurityConfig.kt`: Spring Security bean setup

---

## Testing & Build Workflow

### Command Reference
```bash
# Start databases (PostgreSQL 5433, MongoDB 27017)
make up

# View database logs
make logs-sql  # PostgreSQL
make logs-nsql # MongoDB

# Stop and clean volumes (if corrupted)
make down
make clean

# Run tests (via Gradle)
./gradlew test  # Also generates REST docs

# Build JAR
./gradlew build  # Output: build/libs/apuntar-0.0.1-SNAPSHOT-plain.jar

# Run app
java -Duser.timezone=America/Argentina/Buenos_Aires -jar build/libs/apuntar*.jar
```

### Test Configuration
- **TestContainers**: `TestcontainersConfiguration.kt` auto-spins PostgreSQL for tests
- **HTTP client**: Integration tests use `java.net.http.HttpClient` (not MockMvc)
- **Test isolation**: `@BeforeEach/@AfterEach` create/cleanup test data (UserDao.deleteAll())
- **Timezone**: All tests set to `America/Argentina/Buenos_Aires` (properties in `@TestPropertySource`)

### Test Pattern Example (UserControllerIntegrationTest)
```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
  @LocalServerPort var port: Int = 0
  @Autowired lateinit var userDao: UserDao
  
  @BeforeEach
  fun setup() {
    testUser = User(name="Juan", ..., mail="juan@example.com")
    userDao.save(testUser)
    testToken = jwtUtil.generateToken(testUser.mail)
  }
  
  // Tests use HttpClient to make real HTTP calls
}
```

---

## File & Video Storage

### StorageProvider Interface
Location: `storage/StorageProvider.kt`

```kotlin
interface StorageProvider {
  data class StoredFile(val storedFileName: String, contentType: String?, size: Long)
  fun store(file: MultipartFile): StoredFile
  fun delete(storedFileName: String)
}
```

**Implementation**: `FileSystemStorageProvider.kt` - saves to local `uploads/` directory

**Multipart limits** (application.properties):
- Max file size: 350 MB
- Max request size: 4 GB

**Material associations**: 
- `MaterialFileSQL` + `MaterialVideoSQL` stored as separate entities with FK to `MaterialSQL`
- Cascade delete on material removal

---

## Exception Handling

Custom exceptions in `exception/`:
- `UserAlreadyExistsException`: Duplicate email during registration
- `InvalidMailException`: Constructor validation in User model (regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$`)
- `MaterialNotFoundException`: Material by ID not found
- `InvalidMaterialException`: Malformed material data
- `ForbiddenActionException`: User lacks permission

**Pattern**: Services throw exceptions; controller/GlobalExceptionHandler maps to HTTP status codes and `ApiErrorDto` responses.

---

## Key Configuration Files

### build.gradle.kts
- **Kotlin compiler**: Version 2.2.21, flags `-Xjsr305=strict` enforce null-safety
- **allOpen**: Required for Kotlin JPA entities (annotations: `@Entity`, `@MappedSuperclass`, `@Embeddable`)
- **JUnit 5**: All tests use `useJUnitPlatform()`
- **Dependencies**: JJWT (JWT), Testcontainers (PostgreSQL), SpringDoc OpenAPI (Swagger)

### application.properties
- **PostgreSQL**: `jdbc:postgresql://localhost:5433/apuntar-pg`
- **MongoDB**: `mongodb://root:rootroot@localhost:27017/apuntar-mongo?authSource=admin`
- **JPA**: `ddl-auto=update` (auto-creates schema), `show-sql=true` (debug logging)
- **Jackson**: `fail-on-unknown-properties=true` (strict JSON parsing)
- **Timezone**: Must match JVM startup flag (`-Duser.timezone=America/Argentina/Buenos_Aires`)

### Docker Compose
- **PostgreSQL 18**: Port 5433 (internal 5432), persistent volume `pg_data`
- **MongoDB 8.2.7**: Port 27017, root creds in environment
- Both have health checks; app depends on service_healthy condition

---

## Project Structure

```
src/main/kotlin/ar/edu/unq/apuntar/
├── controller/          # REST endpoints (@RestController)
├── service/             # Business logic (interfaces + impls)
├── persistence/
│   ├── repository/      # Abstractions (UserRepository, MaterialRepository)
│   ├── dao/             # Spring Data DAOs (UserDao extends JpaRepository)
│   └── entity/          # JPA entities (MaterialSQL, MaterialFileSQL, etc.)
├── model/               # Domain models (User, Material, PasswordResetToken)
├── dto/                 # Request/Response DTOs with conversion functions
├── security/            # JWT & authentication (JwtUtil, JwtAuthFilter, etc.)
├── storage/             # File storage abstraction (StorageProvider)
├── exception/           # Custom exceptions
└── config/              # Spring @Configuration beans

uploads/                 # File storage directory (local filesystem)
uploads-test/           # Test file storage
build/                  # Gradle build output
```

---

## Code Style & Conventions

### Kotlin-Specific
- **Null safety**: Use `?.let{}` for Elvis operator; `findByMail()` returns User?
- **Data classes**: DTOs use `data class` for auto-generated copy(), equals(), toString()
- **Extension functions**: `toDto()`, `asModel()` used for conversions (import from dto package)
- **Constructor validation**: Domain models (User) validate in `init` block

### Naming
- **DAO suffix**: `UserDao`, `MaterialDao` - Spring repositories
- **Repository suffix**: `UserRepository`, `MaterialRepository` - custom abstractions
- **Entity suffix**: `MaterialSQL`, `MaterialFileSQL` - JPA entities
- **Service pattern**: Interface `UserService`, impl `UserServiceImpl`

### Spring Annotations
- `@Service`: Service implementations (with `@Transactional` for TX boundary)
- `@Repository`: DAO/repository interfaces
- `@RestController` + `@RequestMapping("/path")`: Endpoint grouping
- `@Valid`: Input DTO validation (JSR-303 annotations on fields)
- `@Transactional`: Demarcates JPA transaction scope (class-level for atomic operations)

---

## Dependencies & External Integration

### Key Libraries
- **Spring Boot 4.0.6**: Web, Data-JPA, Data-REST, Security
- **JJWT 0.12.6**: JWT token handling (HS256/RS256, no external JWT services)
- **JAVE 3.5.0**: Video processing (if Material video upload involves transcoding)
- **SpringDoc OpenAPI 3.0.2**: Swagger/OpenAPI docs auto-generation
- **Testcontainers**: Spins up PostgreSQL for integration tests (no external test DB needed)

### External Services
- None currently; databases are local (Docker) or in-container

---

## Common Development Tasks

### Adding a New Endpoint
1. Create `*ReqDto` in `dto/` (if new input type)
2. Create `*Service` interface + impl in `service/`
3. Add `@PostMapping/@GetMapping` in `controller/`
4. Use `toDto()`/`asModel()` for conversion
5. Add integration test in `src/test/` with HTTP client

### Adding a Database Field
1. Update JPA entity (e.g., `MaterialSQL.kt`) with `@Column` annotation
2. Kotlin data class auto-updates constructor
3. JPA `ddl-auto=update` auto-migrates schema on startup
4. Update DTO if field should be exposed in API

### Running Tests Locally
```bash
make up  # Start databases
./gradlew test  # Tests auto-use Testcontainers + properties
make down  # Clean up
```

### Debugging
- Check PostgreSQL: `make logs-sql` for SQL queries (show-sql=true)
- Check MongoDB: `make logs-nsql` for document operations
- JWT issues: Verify `jwt.secret` in env vars; token expires after 24h

---

## Gotchas & Edge Cases

1. **TimeZone**: App startup hard-codes `America/Argentina/Buenos_Aires` to prevent PostgreSQL TZ mismatches. All tests inherit this.
2. **Email uniqueness**: `@Column(unique=true)` on User.mail; duplicate registration throws `UserAlreadyExistsException`.
3. **Email validation**: Regex in User constructor is strict; invalid emails throw immediately.
4. **Password in DTOs**: Never serialized; verified via `@JsonIgnore` or excluded by null-inclusion policy.
5. **Material cascades**: Deleting a MaterialSQL auto-deletes child files/videos (orphanRemoval=true).
6. **MongoDB auth**: Connection string includes `?authSource=admin` – required for authentication.
7. **File size limits**: 350 MB per file; multipart max request is 4 GB (don't stress-test naively).

---

## Resources for AI Agents
- **JPA/Hibernate docs**: Understanding `@OneToMany` cascade + orphanRemoval
- **JJWT docs**: Token validation edge cases (expiration, signature mismatch)
- **Spring Security**: How `Authentication` principal flows into controllers
- **Testcontainers**: PostgreSQL container lifecycle + service connections

