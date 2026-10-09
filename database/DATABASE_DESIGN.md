# AI Business Operations Agent — Database Design

## 1. Database Technology

- Database: PostgreSQL 17
- ORM: Prisma
- Backend integration: Node.js
- Database name: ai_business_operations

## 2. Database Architecture

The database supports:

1. Identity and business management
2. Master business data
3. Document processing
4. Finance and operations
5. Inventory
6. AI intelligence
7. Agent automation
8. Approval workflows
9. Audit and security
10. File/object-storage metadata

## 3. Core Entity Groups

### Identity
- User
- Business
- Role
- Permission
- BusinessMember

### Master Data
- Customer
- Supplier
- Product
- TaxProfile

### Documents
- Document
- DocumentVersion
- ExtractedField
- ProcessingStatus

### Finance / Operations
- Invoice
- InvoiceItem
- Payment
- Expense
- PurchaseOrder

### Inventory
- Inventory
- InventoryMovement

### AI
- AIInsight
- Prediction
- Conversation
- EmbeddingReference

### Automation
- AgentTask
- Approval
- Notification
- ActionLog

### Audit
- AuditEvent
- SecurityEvent
- ModelActionTrace

### Storage
- FileMetadata
- ObjectStorageReference
- Checksum