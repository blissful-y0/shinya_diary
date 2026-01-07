DROP TRIGGER IF EXISTS profiles_set_public_id ON public.profiles;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS serial_id;

ALTER TABLE public.groups DROP COLUMN IF EXISTS serial_id;

DROP TRIGGER IF EXISTS group_members_set_public_id ON public.group_members;
ALTER TABLE public.group_members DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.group_members DROP COLUMN IF EXISTS serial_id;

DROP TRIGGER IF EXISTS diaries_set_public_id ON public.diaries;
ALTER TABLE public.diaries DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.diaries DROP COLUMN IF EXISTS serial_id;

DROP TRIGGER IF EXISTS comments_set_public_id ON public.comments;
ALTER TABLE public.comments DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.comments DROP COLUMN IF EXISTS serial_id;

DROP TRIGGER IF EXISTS join_requests_set_public_id ON public.join_requests;
ALTER TABLE public.join_requests DROP COLUMN IF EXISTS public_id;
ALTER TABLE public.join_requests DROP COLUMN IF EXISTS serial_id;

CREATE OR REPLACE FUNCTION public.set_public_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    NEW.public_id := public.generate_public_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.generate_public_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO anon;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO anon;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO service_role;
