-- ============================================================
-- Bookly — Demo account seed data
-- Run AFTER schema.sql.
--
-- IMPORTANT: You must first create the demo user in Supabase:
--   1. Dashboard → Authentication → Users → "Add user"
--   2. Email: demo@bookly.app
--   3. Password: demo1234
--   4. Check "Auto Confirm User"
--   5. Copy the user UUID and paste it below in :demo_user_id
--
-- Then run this SQL in: SQL Editor → New query → Run
-- Replace '00000000-0000-0000-0000-000000000000' with the
-- real UUID of the demo user from step 5.
-- ============================================================

DO $$
DECLARE
  demo_user_id uuid;
  biz_id       uuid;
  -- client ids
  c1  uuid; c2  uuid; c3  uuid; c4  uuid; c5  uuid;
  c6  uuid; c7  uuid; c8  uuid; c9  uuid; c10 uuid;
  c11 uuid; c12 uuid; c13 uuid; c14 uuid; c15 uuid;
  c16 uuid; c17 uuid; c18 uuid; c19 uuid; c20 uuid;
  -- service ids
  s1 uuid; s2 uuid; s3 uuid; s4 uuid; s5 uuid;
BEGIN
  -- ====== FIND DEMO USER ======
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@bookly.app'
  LIMIT 1;

  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'Demo user (demo@bookly.app) not found. Create it in Authentication → Users first.';
  END IF;

  -- ====== BUSINESS ======
  -- The trigger already created a business on signup. Find it.
  SELECT id INTO biz_id
  FROM public.businesses
  WHERE owner_id = demo_user_id
  LIMIT 1;

  IF biz_id IS NULL THEN
    INSERT INTO public.businesses (owner_id, name, plan)
    VALUES (demo_user_id, 'Demo Barbershop', 'pro')
    RETURNING id INTO biz_id;
  ELSE
    UPDATE public.businesses
    SET name = 'Demo Barbershop', plan = 'pro'
    WHERE id = biz_id;
  END IF;

  -- ====== SERVICES ======
  INSERT INTO public.services (id, business_id, name, description, duration_min, price_cents, active) VALUES
    (gen_random_uuid(), biz_id, 'Haircut',         'Classic men''s haircut with razor finish',    30, 3500, true) RETURNING id INTO s1;
  INSERT INTO public.services (id, business_id, name, description, duration_min, price_cents, active) VALUES
    (gen_random_uuid(), biz_id, 'Beard trim',      'Shape and trim with hot towel',              20, 2000, true) RETURNING id INTO s2;
  INSERT INTO public.services (id, business_id, name, description, duration_min, price_cents, active) VALUES
    (gen_random_uuid(), biz_id, 'Hair + Beard',    'Full combo: haircut plus beard',             45, 5000, true) RETURNING id INTO s3;
  INSERT INTO public.services (id, business_id, name, description, duration_min, price_cents, active) VALUES
    (gen_random_uuid(), biz_id, 'Kids haircut',    'Under 12 years',                             20, 2500, true) RETURNING id INTO s4;
  INSERT INTO public.services (id, business_id, name, description, duration_min, price_cents, active) VALUES
    (gen_random_uuid(), biz_id, 'Hot towel shave', 'Traditional straight razor shave',           40, 4500, true) RETURNING id INTO s5;

  -- ====== CLIENTS (20) ======
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Lucas Silva',      'lucas@example.com',    '+5511999001001', 'Prefers fade') RETURNING id INTO c1;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Pedro Santos',     'pedro@example.com',    '+5511999001002', NULL) RETURNING id INTO c2;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Gabriel Oliveira', 'gabriel@example.com',  '+5511999001003', 'Allergic to certain products') RETURNING id INTO c3;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Rafael Costa',     'rafael@example.com',   '+5511999001004', NULL) RETURNING id INTO c4;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Matheus Lima',     'matheus@example.com',  '+5511999001005', 'Regular — every 3 weeks') RETURNING id INTO c5;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Bruno Almeida',    'bruno@example.com',    '+5511999001006', NULL) RETURNING id INTO c6;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Felipe Souza',     'felipe@example.com',   '+5511999001007', NULL) RETURNING id INTO c7;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Thiago Ferreira',  'thiago@example.com',   '+5511999001008', 'Likes a longer top') RETURNING id INTO c8;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Diego Rocha',      'diego@example.com',    '+5511999001009', NULL) RETURNING id INTO c9;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'André Martins',    'andre@example.com',    '+5511999001010', NULL) RETURNING id INTO c10;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'João Pereira',     'joao@example.com',     '+5511999001011', NULL) RETURNING id INTO c11;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Vinícius Ribeiro', 'vinicius@example.com', '+5511999001012', 'Brings his son') RETURNING id INTO c12;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Gustavo Carvalho', 'gustavo@example.com',  '+5511999001013', NULL) RETURNING id INTO c13;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Henrique Gomes',   'henrique@example.com', '+5511999001014', NULL) RETURNING id INTO c14;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Caio Araújo',      'caio@example.com',     '+5511999001015', 'VIP client') RETURNING id INTO c15;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Daniel Barbosa',   'daniel@example.com',   '+5511999001016', NULL) RETURNING id INTO c16;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Igor Nascimento',  'igor@example.com',     '+5511999001017', NULL) RETURNING id INTO c17;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Alex Cardoso',     'alex@example.com',     '+5511999001018', 'Prefers morning slots') RETURNING id INTO c18;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Marcos Teixeira',  'marcos@example.com',   '+5511999001019', NULL) RETURNING id INTO c19;
  INSERT INTO public.clients (id, business_id, name, email, phone, notes) VALUES
    (gen_random_uuid(), biz_id, 'Leandro Dias',     'leandro@example.com',  '+5511999001020', NULL) RETURNING id INTO c20;

  -- ====== APPOINTMENTS (spread across last 4 months + 5 upcoming) ======
  -- Past completed (generates revenue for chart)
  INSERT INTO public.appointments (business_id, client_id, service_id, starts_at, ends_at, status) VALUES
    -- January
    (biz_id, c1,  s1, '2026-01-05 09:00:00+00', '2026-01-05 09:30:00+00', 'completed'),
    (biz_id, c2,  s3, '2026-01-07 10:00:00+00', '2026-01-07 10:45:00+00', 'completed'),
    (biz_id, c3,  s2, '2026-01-10 14:00:00+00', '2026-01-10 14:20:00+00', 'completed'),
    (biz_id, c4,  s1, '2026-01-12 11:00:00+00', '2026-01-12 11:30:00+00', 'completed'),
    (biz_id, c5,  s3, '2026-01-15 15:00:00+00', '2026-01-15 15:45:00+00', 'completed'),
    (biz_id, c6,  s5, '2026-01-18 09:00:00+00', '2026-01-18 09:40:00+00', 'completed'),
    (biz_id, c7,  s1, '2026-01-20 10:30:00+00', '2026-01-20 11:00:00+00', 'completed'),
    (biz_id, c8,  s2, '2026-01-22 16:00:00+00', '2026-01-22 16:20:00+00', 'completed'),
    (biz_id, c9,  s4, '2026-01-25 13:00:00+00', '2026-01-25 13:20:00+00', 'completed'),
    (biz_id, c10, s3, '2026-01-28 09:00:00+00', '2026-01-28 09:45:00+00', 'completed'),
    -- February
    (biz_id, c11, s1, '2026-02-02 09:00:00+00', '2026-02-02 09:30:00+00', 'completed'),
    (biz_id, c12, s3, '2026-02-05 10:00:00+00', '2026-02-05 10:45:00+00', 'completed'),
    (biz_id, c13, s5, '2026-02-08 14:00:00+00', '2026-02-08 14:40:00+00', 'completed'),
    (biz_id, c14, s1, '2026-02-10 11:00:00+00', '2026-02-10 11:30:00+00', 'completed'),
    (biz_id, c15, s2, '2026-02-12 09:30:00+00', '2026-02-12 09:50:00+00', 'completed'),
    (biz_id, c1,  s3, '2026-02-15 15:00:00+00', '2026-02-15 15:45:00+00', 'completed'),
    (biz_id, c2,  s1, '2026-02-18 10:00:00+00', '2026-02-18 10:30:00+00', 'completed'),
    (biz_id, c3,  s4, '2026-02-20 13:00:00+00', '2026-02-20 13:20:00+00', 'completed'),
    (biz_id, c5,  s5, '2026-02-22 09:00:00+00', '2026-02-22 09:40:00+00', 'completed'),
    (biz_id, c8,  s1, '2026-02-25 16:00:00+00', '2026-02-25 16:30:00+00', 'completed'),
    (biz_id, c16, s3, '2026-02-27 10:00:00+00', '2026-02-27 10:45:00+00', 'completed'),
    -- March
    (biz_id, c4,  s1, '2026-03-02 09:00:00+00', '2026-03-02 09:30:00+00', 'completed'),
    (biz_id, c6,  s3, '2026-03-05 10:00:00+00', '2026-03-05 10:45:00+00', 'completed'),
    (biz_id, c7,  s2, '2026-03-07 14:00:00+00', '2026-03-07 14:20:00+00', 'completed'),
    (biz_id, c9,  s5, '2026-03-10 11:00:00+00', '2026-03-10 11:40:00+00', 'completed'),
    (biz_id, c10, s1, '2026-03-12 09:30:00+00', '2026-03-12 10:00:00+00', 'completed'),
    (biz_id, c11, s3, '2026-03-15 15:00:00+00', '2026-03-15 15:45:00+00', 'completed'),
    (biz_id, c12, s1, '2026-03-18 10:00:00+00', '2026-03-18 10:30:00+00', 'completed'),
    (biz_id, c17, s4, '2026-03-20 13:00:00+00', '2026-03-20 13:20:00+00', 'completed'),
    (biz_id, c18, s5, '2026-03-22 09:00:00+00', '2026-03-22 09:40:00+00', 'completed'),
    (biz_id, c19, s3, '2026-03-25 16:00:00+00', '2026-03-25 16:45:00+00', 'completed'),
    (biz_id, c20, s1, '2026-03-28 10:00:00+00', '2026-03-28 10:30:00+00', 'completed'),
    (biz_id, c15, s2, '2026-03-30 14:00:00+00', '2026-03-30 14:20:00+00', 'completed'),
    -- April (partial — current month)
    (biz_id, c1,  s1, '2026-04-01 09:00:00+00', '2026-04-01 09:30:00+00', 'completed'),
    (biz_id, c2,  s3, '2026-04-03 10:00:00+00', '2026-04-03 10:45:00+00', 'completed'),
    (biz_id, c3,  s5, '2026-04-05 14:00:00+00', '2026-04-05 14:40:00+00', 'completed'),
    (biz_id, c4,  s1, '2026-04-07 11:00:00+00', '2026-04-07 11:30:00+00', 'completed'),
    (biz_id, c5,  s2, '2026-04-08 09:30:00+00', '2026-04-08 09:50:00+00', 'completed'),
    -- canceled / no_show for realism
    (biz_id, c14, s1, '2026-03-08 09:00:00+00', '2026-03-08 09:30:00+00', 'canceled'),
    (biz_id, c16, s2, '2026-02-14 10:00:00+00', '2026-02-14 10:20:00+00', 'no_show'),
    -- Upcoming (scheduled)
    (biz_id, c6,  s3, '2026-04-10 09:00:00+00', '2026-04-10 09:45:00+00', 'scheduled'),
    (biz_id, c7,  s1, '2026-04-11 10:30:00+00', '2026-04-11 11:00:00+00', 'scheduled'),
    (biz_id, c8,  s5, '2026-04-12 14:00:00+00', '2026-04-12 14:40:00+00', 'scheduled'),
    (biz_id, c9,  s2, '2026-04-14 09:00:00+00', '2026-04-14 09:20:00+00', 'scheduled'),
    (biz_id, c10, s3, '2026-04-15 15:00:00+00', '2026-04-15 15:45:00+00', 'scheduled');

  RAISE NOTICE 'Demo seed complete! Business: %, 20 clients, 5 services, 45 appointments', biz_id;
END $$;
