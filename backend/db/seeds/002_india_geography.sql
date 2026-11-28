-- India launch geography (F-GEO-01): Madhya Pradesh -> Jabalpur.
-- Every market is seeded NOT LIVE. Going live is an admin action on
-- market_activations (F-GEO-03, CFG-13); this seed never activates a market.
-- Idempotent: safe to re-run, and cleans up legacy Rajasthan/Delhi seed cities
-- when nothing references them.
INSERT INTO countries (iso_code, name, localized_names)
VALUES ('IN', 'India', '{"hi": "भारत"}'::jsonb)
ON CONFLICT (iso_code) DO NOTHING;

INSERT INTO regions (country_id, name, localized_names, region_type)
SELECT c.id, v.name, v.localized_names, v.region_type
FROM countries c
CROSS JOIN (VALUES
    ('Madhya Pradesh', '{"hi": "मध्य प्रदेश"}'::jsonb, 'state')
) AS v(name, localized_names, region_type)
WHERE c.iso_code = 'IN'
ON CONFLICT (country_id, name) DO NOTHING;

INSERT INTO cities (country_id, region_id, name, localized_names, time_zone)
SELECT c.id, r.id, v.city, v.localized_names, 'Asia/Kolkata'
FROM countries c
JOIN regions r ON r.country_id = c.id
JOIN (VALUES
    ('Madhya Pradesh', 'Jabalpur', '{"hi": "जबलपुर"}'::jsonb)
) AS v(region, city, localized_names) ON v.region = r.name
WHERE c.iso_code = 'IN'
  AND NOT EXISTS (
      SELECT 1 FROM cities x
      WHERE x.country_id = c.id AND x.region_id = r.id AND x.name = v.city
  );

INSERT INTO market_activations (country_id, city_id, status)
SELECT c.country_id, c.id, 'not_live'
FROM cities c
JOIN countries co ON co.id = c.country_id AND co.iso_code = 'IN'
WHERE NOT EXISTS (SELECT 1 FROM market_activations m WHERE m.city_id = c.id);

-- Remove legacy Jaipur / Ajmer / Sikar / Delhi NCR seed rows if unreferenced.
DELETE FROM market_activations m
USING cities c
JOIN countries co ON co.id = c.country_id AND co.iso_code = 'IN'
WHERE m.city_id = c.id
  AND c.name IN ('Jaipur', 'Ajmer', 'Sikar', 'Delhi NCR')
  AND NOT EXISTS (SELECT 1 FROM localities l WHERE l.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM market_waitlist w WHERE w.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM saved_locations sl WHERE sl.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM service_areas sa WHERE sa.city_id = c.id);

DELETE FROM cities c
USING countries co
WHERE c.country_id = co.id
  AND co.iso_code = 'IN'
  AND c.name IN ('Jaipur', 'Ajmer', 'Sikar', 'Delhi NCR')
  AND NOT EXISTS (SELECT 1 FROM market_activations m WHERE m.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM localities l WHERE l.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM market_waitlist w WHERE w.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM saved_locations sl WHERE sl.city_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM service_areas sa WHERE sa.city_id = c.id);

DELETE FROM regions r
USING countries co
WHERE r.country_id = co.id
  AND co.iso_code = 'IN'
  AND r.name IN ('Rajasthan', 'Delhi')
  AND NOT EXISTS (SELECT 1 FROM cities c WHERE c.region_id = r.id)
  AND NOT EXISTS (SELECT 1 FROM service_areas sa WHERE sa.region_id = r.id);
