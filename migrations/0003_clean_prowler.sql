CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"job_title" text,
	"company" text,
	"company_description" text,
	"bio" text,
	"pain_points" text,
	"skills" text,
	"source_type" "offering_source_type" DEFAULT 'manual' NOT NULL,
	"source_url" text,
	"extraction_status" "extraction_status" DEFAULT 'pending' NOT NULL,
	"raw_extracted_data" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;