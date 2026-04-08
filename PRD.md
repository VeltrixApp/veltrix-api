# Product Requirements Document (PRD)

## 1. Overview

### Product Name

Veltrix API — Developer Intelligence Backend

### Objective

Design and implement a scalable backend system capable of ingesting, analyzing, and transforming tech news into structured, actionable insights for developers, ensuring data consistency, content quality, and performance under continuous ingestion.

### Development Approach

This project follows:

* Spec-Driven Development (SDD)
* Test-Driven Development (TDD)

---

## 2. Problem Statement

Modern developers face:

* Information overload from multiple sources (news, forums, social media)
* Low signal-to-noise ratio in tech content
* Lack of context on real-world impact
* Time constraints for staying updated

This project simulates a real-world backend that filters, enriches, and prioritizes content to deliver meaningful insights.

---

## 3. Goals

### Functional Goals

* Content ingestion from external sources (APIs, URLs)
* AI-powered content transformation
* Structured content generation (summary, insights)
* Draft → Review → Publish workflow
* Duplicate prevention (idempotent ingestion)
* Scoring system for relevance and impact

---

### Non-Functional Goals

* High availability under continuous ingestion
* Scalability for increasing data volume
* Fault tolerance in AI and ingestion layers
* Observability of content processing pipeline
* Performance under concurrent ingestion requests

---

## 4. Non-Goals

* Full frontend implementation
* Real-time streaming architecture (phase 1)
* Complex personalization engine (phase 1)
* Multi-region deployment

---

## 5. System Architecture

### Architecture Style

Modular Monolith (prepared for microservices migration)

---

### Components

* API Layer (NestJS)
* Service Layer (business logic)
* Data Layer (PostgreSQL via Prisma)
* AI Processing Layer (content generation)
* Ingestion Layer (external sources)

---

### Key Patterns

* Idempotent ingestion
* Human-in-the-loop workflow
* Content enrichment pipeline
* Structured data modeling
* Rate limiting
* Validation-first architecture

---

## 6. Core Features

### Content Ingestion

* Fetch content from URLs or APIs
* Normalize incoming data
* Prevent duplicate ingestion (sourceUrl uniqueness)

---

### AI Processing

* Generate:

  * Title
  * Summary
  * Key points
  * Why it matters

* Validate AI output before persistence

---

### Post Management

* Draft creation
* Manual editing
* Publish workflow

---

### Workflow System

* Status lifecycle:

  * DRAFT
  * REVIEW
  * PUBLISHED

---

### Scoring System

* Impact score
* Risk score
* Opportunity score

---

### Idempotency

* Prevent duplicate content creation
* Return existing resource for repeated inputs

---

### Rate Limiting

* Protect ingestion and AI endpoints

---

## 7. Data Model

### Post

* id

* title

* summary

* content

* keyPoints[]

* whyItMatters

* sourceUrl

* source

* impactScore

* riskScore

* opportunityScore

* status

* publishedAt

* createdAt

* updatedAt

---

## 8. API Requirements

### Posts

* POST /posts
* GET /posts
* PATCH /posts/:id
* POST /posts/:id/publish

---

### Ingestion

* POST /posts/from-url

---

### AI

* POST /posts/ai/analyze

---

### Filtering

* GET /posts?status=DRAFT
* GET /posts?tag=backend

---

## 9. Data Consistency & Idempotency

* sourceUrl must be unique
* Duplicate ingestion must not create new records
* Same input must produce deterministic output (when possible)
* AI output must be validated before saving

---

## 10. Observability

* Structured logging (Pino)
* Request tracing (correlation IDs)
* AI pipeline logging
* Error handling and reporting

---

## 11. Testing Strategy (TDD + Full Coverage)

### Approach

All features must be developed using Test-Driven Development (TDD):

1. Write failing test
2. Implement minimal code
3. Refactor safely

---

## 11.1 Test Levels

### Unit Tests

Focus:

* AI response parsing
* scoring logic
* validation rules

---

### Integration Tests

Focus:

* API + database interactions
* ingestion flow
* AI integration (mocked)

---

### End-to-End (E2E) Tests

Scope:

* URL → AI → draft → publish

---

## 11.2 Critical Flows

### Content Ingestion

* Valid URL → creates structured draft
* Invalid URL → rejected

---

### AI Processing

* AI returns valid structured output
* AI failure handled gracefully

---

### Publishing

* Draft → published successfully
* Invalid draft cannot be published

---

### Idempotency

* Same URL → single post created
* Duplicate requests → no duplicates

---

## 11.3 Negative Testing

Scenarios:

* Invalid URL
* Empty payload
* AI malformed response
* Missing required fields

Expected behavior:

* Proper HTTP status codes
* No system crashes
* Consistent error format

---

## 11.4 Concurrency Testing

Scenarios:

* Multiple requests with same URL
* High ingestion rate

Expected:

* No duplicate posts
* Consistent DB state

---

## 11.5 Data Integrity Testing

* No duplicate entries
* Proper status transitions
* No partial writes
* Valid structured data

---

## 11.6 AI Reliability Testing

* Incomplete responses handled
* Unexpected formats validated
* Fallback strategies applied

---

## 11.7 Failure-Path Testing

Scenarios:

* Database unavailable
* AI service unavailable

Expected:

* Graceful degradation
* Clear error responses
* No data corruption

---

## 11.8 Regression Testing

* Every bug introduces a test case
* Prevent reintroduction of issues

---

## 12. Performance & Limit Testing

### Metrics

* API latency
* AI response time
* ingestion throughput
* DB performance

---

### Test Types

* Load testing (continuous ingestion)
* Stress testing (high request volume)
* Spike testing (burst traffic)

---

## 13. Performance Criteria (Success Metrics)

The system must:

* Handle continuous ingestion reliably
* Maintain:

  * p95 latency < 700ms
* Prevent duplicate content
* Maintain stable AI processing

---

## 14. Security

* Input validation
* Rate limiting
* Secure headers
* Sanitization of external content
* Environment-based secrets

---

## 15. Deployment

* Dockerized environment
* Environment-based configuration
* Cloud-ready (AWS / Railway)

---

## 16. Future Improvements

* Automated ingestion pipelines
* Full scraping system
* Personalization engine
* Recommendation system
* Event-driven architecture (Kafka)
* Microservices architecture

---

## 17. Success Criteria

* No duplicate posts under concurrent ingestion
* Reliable AI-generated content
* Stable workflow (draft → publish)
* System remains stable under load
* All critical flows covered by tests
* Clear error handling and observability
* Positive feedback from users (developers) on content quality and relevance
