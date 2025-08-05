 -- Create global_settings table
CREATE TABLE IF NOT EXISTS "global_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- Create unique index on key
CREATE UNIQUE INDEX IF NOT EXISTS "global_settings_key_key" ON "global_settings"("key");

-- Insert default theme setting
INSERT INTO "global_settings" ("id", "key", "value", "description", "updatedBy", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'theme',
    'default',
    'Global website theme color',
    'system',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("key") DO NOTHING;