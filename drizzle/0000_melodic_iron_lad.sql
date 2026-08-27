CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text,
	"slug" text,
	"name" text,
	"brand" text,
	"category" text,
	"subcategory" text,
	"price" numeric,
	"minPrice" numeric,
	"maxPrice" numeric,
	"pricePoints" numeric,
	"shortDescription" text,
	"stockStatus" text,
	"images" text
);
