CREATE TYPE "public"."deporte" AS ENUM('padel', 'tenis', 'futbol');--> statement-breakpoint
CREATE TYPE "public"."estado_reserva" AS ENUM('confirmada', 'cancelada');--> statement-breakpoint
CREATE TABLE "idempotencia" (
	"usuario_id" uuid NOT NULL,
	"clave" uuid NOT NULL,
	"hash_peticion" text NOT NULL,
	"estado_http" integer,
	"respuesta" jsonb,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idempotencia_usuario_id_clave_pk" PRIMARY KEY("usuario_id","clave")
);
--> statement-breakpoint
CREATE TABLE "intentos_login" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clave" text NOT NULL,
	"intento_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pista_dias" (
	"pista_id" uuid NOT NULL,
	"fecha" date NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "pista_dias_pista_id_fecha_pk" PRIMARY KEY("pista_id","fecha")
);
--> statement-breakpoint
CREATE TABLE "pistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"deporte" "deporte" NOT NULL,
	"duracion_min" integer NOT NULL,
	"apertura" time NOT NULL,
	"cierre" time NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pista_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"periodo" "tstzrange" NOT NULL,
	"estado" "estado_reserva" DEFAULT 'confirmada' NOT NULL,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sesiones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"creada_en" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_uso" timestamp with time zone DEFAULT now() NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	CONSTRAINT "sesiones_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"nombre" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idempotencia" ADD CONSTRAINT "idempotencia_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pista_dias" ADD CONSTRAINT "pista_dias_pista_id_pistas_id_fk" FOREIGN KEY ("pista_id") REFERENCES "public"."pistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_pista_id_pistas_id_fk" FOREIGN KEY ("pista_id") REFERENCES "public"."pistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intentos_login_clave" ON "intentos_login" USING btree ("clave","intento_en");--> statement-breakpoint
CREATE INDEX "reservas_pista" ON "reservas" USING btree ("pista_id");--> statement-breakpoint
CREATE INDEX "reservas_usuario" ON "reservas" USING btree ("usuario_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_email_unico" ON "usuarios" USING btree ("email");