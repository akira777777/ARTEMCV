import os
import re

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)
    print(f"Updated {path}")

# Fix Hero.tsx
hero_path = 'components/Hero.tsx'
if os.path.exists(hero_path):
    content = read_file(hero_path)

    # Locate "Floating Orbs" end
    floating_orbs_start = content.find('{/* Floating Orbs */}')
    if floating_orbs_start != -1:
        # Split logic
        pre_orbs = content[:floating_orbs_start]
        post_orbs = content[floating_orbs_start:]

        # Find the end of the map loop `))}`
        map_end_idx = post_orbs.find('))}')
        if map_end_idx != -1:
            map_end_idx += 3

            # Find the LAST "Animated Background Elements"
            last_anim_idx = post_orbs.rfind('{/* Animated Background Elements */}')

            if last_anim_idx != -1 and last_anim_idx > map_end_idx:
                 clean_middle = """
      </div>

      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ width: `${Math.min(scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1) * 100, 100)}%` }}
        role="progressbar"
        aria-valuenow={Math.min(scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1) * 100, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll progress indicator"
      />

      """
                 clean_post_orbs = post_orbs[:map_end_idx] + clean_middle + post_orbs[last_anim_idx:]
                 new_content = pre_orbs + post_orbs[:0] + clean_post_orbs # post_orbs[:0] is empty, just for logic clarity
                 # Actually new_content = pre_orbs + clean_post_orbs matches better
                 write_file(hero_path, pre_orbs + clean_post_orbs)
            else:
                 print("Could not find safe anchor points in Hero.tsx (last_anim_idx)")
        else:
             print("Could not find map end in Hero.tsx")
    else:
         print("Could not find Floating Orbs in Hero.tsx")

# Fix others
for path in ['components/Footer2026.tsx', 'components/InteractiveGallery.tsx', 'components/CardStack.tsx']:
    if os.path.exists(path):
        c = read_file(path)
        if 'React.memo' in c and c.strip().endswith('};'):
            new_c = re.sub(r'\}\;\s*$', '});\n', c)
            if new_c != c:
                write_file(path, new_c)
            else:
                print(f"No change needed for {path} (regex match failed?)")

# Fix MobileMenu.tsx
mm_path = 'components/MobileMenu.tsx'
if os.path.exists(mm_path):
    c = read_file(mm_path)
    c = c.replace('aria-label="Open navigation menu"', "aria-label={t('nav.aria.open')}")
    c = c.replace('aria-label="Close navigation menu"', "aria-label={t('nav.aria.close')}")
    write_file(mm_path, c)
