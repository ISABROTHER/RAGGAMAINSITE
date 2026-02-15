/*
  # Seed Assemblymen Data
  
  1. Purpose
    - Restore all 15 assemblymen to the database
    - Set them as active and visible on the public assemblymen page
  
  2. Data Inserted
    - 15 assemblymen with their contact information and zones
    - All marked as active (is_active = true)
    - Role set to 'assemblyman'
    - Ghana flag as default avatar
    
  3. Implementation
    - Creates auth users with default password
    - Inserts profile records with proper role and status
    - Handles existing records gracefully
*/

DO $$
DECLARE
  user_id uuid;
  user_email text;
  user_name text;
  user_phone text;
  user_zone text;
  user_exists boolean;
BEGIN
  CREATE TEMP TABLE temp_assemblymen (
    name text,
    phone text,
    zone text,
    email text
  );
  
  INSERT INTO temp_assemblymen VALUES
    ('Benjamin Benyah', '0243043906', '3rd Ridge / Nkanfoa', 'benjamin.benyah@ccn.gov.gh'),
    ('Isaac Kobina Mensah', '0549902118', 'Pedu Nguabado', 'isaac.mensah@ccn.gov.gh'),
    ('James Arthur', '0248483321', 'Pedu Abakadze', 'james.arthur@ccn.gov.gh'),
    ('Wisdom Suka', '0242532998', 'Abakam / Aheneboboi', 'wisdom.suka@ccn.gov.gh'),
    ('Jacob Kakra Ewusie', '0243563349', 'University Old Site / Apewosika', 'jacob.ewusie@ccn.gov.gh'),
    ('John Kilson Mensah', '0548214411', 'University New Site / Kwaprow', 'john.mensah@ccn.gov.gh'),
    ('Moses Arthur', '0246505955', 'Nkwantado / Assim', 'moses.arthur@ccn.gov.gh'),
    ('Abdul Malik', '0244031098', 'Etsifi / Eyifua', 'abdul.malik@ccn.gov.gh'),
    ('Vitus Rosevare Kobina Danquah', '0244082362', 'Kakomdo', 'vitus.danquah@ccn.gov.gh'),
    ('Ibrahim Dawda Mohammed', '0548047421', 'Ebubonko / Amissano', 'ibrahim.mohammed@ccn.gov.gh'),
    ('Eric Kofi Boateng', '0595528417', 'Essuekyir', 'eric.boateng@ccn.gov.gh'),
    ('Robert Mensah', '0243344026', 'Ankaful', 'robert.mensah@ccn.gov.gh'),
    ('David Owu', '0593098860', 'Mpeasem / Brimso', 'david.owu@ccn.gov.gh'),
    ('Paul Nat Amissah', '0243930021', 'Koforidua / Nyinasin', 'paul.amissah@ccn.gov.gh'),
    ('Alhaji Mustapha Abdullah', '0244707883', 'Efutu / Mampong', 'mustapha.abdullah@ccn.gov.gh');
  
  FOR user_email, user_name, user_phone, user_zone IN 
    SELECT email, name, phone, zone FROM temp_assemblymen
  LOOP
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) INTO user_exists;
    
    IF NOT user_exists THEN
      user_id := gen_random_uuid();
      
      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token
      ) VALUES (
        user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        user_email,
        crypt('ChangeMe123!', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('full_name', user_name),
        false,
        '',
        ''
      );
      
      INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        user_id::text,
        user_id,
        jsonb_build_object('sub', user_id::text, 'email', user_email),
        'email',
        now(),
        now(),
        now()
      );
    ELSE
      SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    END IF;
    
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      phone,
      zone,
      avatar_url,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_email,
      user_name,
      user_phone,
      user_zone,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/640px-Flag_of_Ghana.svg.png',
      'assemblyman',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      zone = EXCLUDED.zone,
      role = 'assemblyman',
      is_active = true,
      updated_at = now();
  END LOOP;
  
  DROP TABLE temp_assemblymen;
END $$;
