ALTER TABLE "prospects" ADD COLUMN "sources" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "prospects" DROP COLUMN "source_type";--> statement-breakpoint
ALTER TABLE "prospects" DROP COLUMN "source_url";