import crypto from "crypto"

interface EncryptionResult {
  encrypted: string
  iv: string
}

interface AnonymizedData {
  phoneNumber: string
  originalHash: string
}

export class DataGovernanceService {
  private encryptionKey: string
  private algorithm = "aes-256-gcm"

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey()
  }

  private generateKey(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  // Encrypt sensitive data (PII)
  encrypt(data: string): EncryptionResult {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.encryptionKey, "hex"), iv)

    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return {
      encrypted: encrypted + authTag.toString("hex"),
      iv: iv.toString("hex"),
    }
  }

  // Decrypt sensitive data
  decrypt(encrypted: string, iv: string): string {
    const authTag = Buffer.from(encrypted.slice(-32), "hex")
    const encryptedData = encrypted.slice(0, -32)

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, "hex"),
      Buffer.from(iv, "hex"),
    )

    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  // Anonymize phone numbers (one-way hash)
  anonymizePhoneNumber(phoneNumber: string): AnonymizedData {
    const normalized = phoneNumber.replace(/\D/g, "")
    const hash = crypto.createHash("sha256").update(normalized).digest("hex")

    // Keep last 4 digits for support purposes
    const masked = `***${normalized.slice(-4)}`

    return {
      phoneNumber: masked,
      originalHash: hash,
    }
  }

  // Hash for comparison without storing original
  hashForComparison(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  // Generate audit log entry
  createAuditLog(action: string, userId: string, data: any) {
    return {
      timestamp: new Date().toISOString(),
      action,
      userId,
      dataHash: this.hashForComparison(JSON.stringify(data)),
      ipAddress: data.ipAddress || "unknown",
    }
  }

  // Check data retention policy (GDPR compliance)
  shouldDeleteData(createdAt: Date, retentionDays = 90): boolean {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdAt.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > retentionDays
  }

  // Anonymize transaction data for analytics
  anonymizeTransaction(transaction: any) {
    return {
      ...transaction,
      sender: this.anonymizePhoneNumber(transaction.sender).phoneNumber,
      recipient: this.anonymizePhoneNumber(transaction.recipient).phoneNumber,
      senderHash: this.hashForComparison(transaction.sender),
      recipientHash: this.hashForComparison(transaction.recipient),
    }
  }
}
