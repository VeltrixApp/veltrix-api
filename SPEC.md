# Veltrix API — SPEC.md (System Specification)

## 1. System Overview

Veltrix API is a backend system designed to ingest, process, and transform raw tech content into structured, actionable insights for developers.

The system prioritizes:

* Simplicity
* Data integrity
* Deterministic workflows
* Human-in-the-loop validation

---

## 2. Design Principles

### 2.1 Simplicity First

* Avoid premature abstraction
* Prefer clear, readable logic over flexible systems

### 2.2 Deterministic Behavior

* Same input → same output (when possible)
* Idempotent ingestion

### 2.3 Validation at Boundaries

* All external input must be validated
* AI output must be validated before persistence

### 2.4 Human-in-the-Loop

* No auto-publishing
* Every post goes through review

---

## 3. System Flow

### 3.1 Content Ingestion Flow

```
URL Input
→ Fetch Content
→ Send to AI
→ Parse Response
→ Validate Structure
→ Check Duplicates
→ Save as DRAFT
```

---

### 3.2 Publishing Flow

```
DRAFT
→ (Manual Review)
→ REVIEW
→ (Approval)
→ PUBLISHED
```

---

## 4. Data Modeling Decisions

### 4.1 Post Entity Design

Post must be **structured**, not raw text.

#### Decision:

Store:

* title
* summary
* keyPoints[]
* whyItMatters

#### Reason:

* Enables filtering
* Enables future personalization
* Easier frontend consumption

---

### 4.2 sourceUrl Uniqueness

#### Decision:

`sourceUrl` is unique

#### Reason:

* Prevent duplicate ingestion
* Ensures idempotency
* Simplifies logic

---

### 4.3 Status as Enum

#### Decision:

Use enum:

* DRAFT
* REVIEW
* PUBLISHED

#### Reason:

* Prevent invalid states
* Enforce workflow consistency

---

## 5. API Design Decisions

### 5.1 REST over GraphQL

#### Decision:

Use REST

#### Reason:

* Simpler for MVP
* Easier debugging
* Lower complexity

---

### 5.2 Endpoint Design

* POST /posts → manual creation
* GET /posts → retrieval
* PATCH /posts/:id → updates
* POST /posts/:id/publish → workflow transition
* POST /posts/from-url → ingestion pipeline

---

## 6. AI Integration Design

### 6.1 AI as a Non-Trusted Source

#### Rule:

AI output is NEVER trusted directly

---

### 6.2 Expected AI Output Structure

```json
{
  "title": "",
  "summary": "",
  "keyPoints": [],
  "whyItMatters": ""
}
```

---

### 6.3 Validation Strategy

* Ensure all fields exist
* Validate types
* Reject incomplete responses

---

### 6.4 Fallback Strategy

If AI fails:

* return error
* do not persist partial data

---

## 7. Idempotency Strategy

### 7.1 Duplicate Detection

Check:

* sourceUrl

---

### 7.2 Behavior

If duplicate:

* return existing post
* do not create new record

---

### 7.3 Reason

* Simplifies ingestion logic
* Avoids duplicate processing

---

## 8. Error Handling Strategy

### 8.1 Principles

* Never expose internal errors
* Use consistent error format

---

### 8.2 Error Types

* Validation errors → 400
* Not found → 404
* Unauthorized → 401
* Conflict (duplicates) → 409 (optional)
* Internal errors → 500

---

## 9. Validation Strategy

### 9.1 Input Validation

Use:

* class-validator

---

### 9.2 Fields to Validate

* URL format
* Required fields
* Data types

---

### 9.3 AI Validation

* Ensure structured output
* Reject malformed data

---

## 10. Logging & Observability

### 10.1 Logging Strategy

Use:

* Structured logging (Pino)

---

### 10.2 Log Events

* Incoming requests
* AI processing steps
* Errors
* State transitions

---

### 10.3 Correlation IDs

* Assign per request
* Track full flow

---

## 11. Testing Strategy (Implementation Level)

### 11.1 Unit Tests

* AI parsing logic
* scoring logic
* validation rules

---

### 11.2 Integration Tests

* API + DB interaction
* ingestion flow

---

### 11.3 E2E Tests

```
POST /posts/from-url
→ AI processing
→ DB persistence
→ publish
```

---

## 12. Performance Considerations

### 12.1 Bottlenecks

* AI response latency
* DB writes under ingestion load

---

### 12.2 Strategy

* Keep synchronous for MVP
* Avoid queues initially
* Optimize later if needed

---

## 13. Security Considerations

* Validate all external input
* Sanitize content
* Rate limit ingestion endpoints
* Store secrets in environment variables

---

## 14. Trade-offs

### Trade-off 1 — Simplicity vs Scalability

* Chose simplicity first
* Accept future refactor

---

### Trade-off 2 — Sync vs Async Processing

* Chose synchronous pipeline
* Easier debugging

---

### Trade-off 3 — AI Flexibility vs Reliability

* Chose strict validation
* Reject bad responses

---

## 15. Future Evolution

* Move ingestion to async queues
* Add event-driven architecture
* Introduce recommendation system
* Add personalization layer

---

## 16. Open Questions (Must Be Resolved During Development)

* Should scoring be AI-based or rule-based?
* Should we store raw content for reprocessing?
* How strict should AI validation be?
* When to introduce async processing?

---

## 17. Developer Workflow (With AI Agent)

### Rules

* Always ask before implementing
* Never assume requirements
* Prefer 1–2 solutions max
* Wait for confirmation

---

### Execution Flow

```
1. Read PRD
2. Read SPEC
3. Ask clarifying questions
4. Propose solution
5. Confirm
6. Implement
7. Test
```

---

## Final Note

This system is designed to evolve.

The goal is not perfection.

The goal is:

* clarity
* correctness
* iteration
