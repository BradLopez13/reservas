CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_sin_solape"
  EXCLUDE USING gist ("pista_id" WITH =, "periodo" WITH &&) WHERE ("estado" = 'confirmada');
