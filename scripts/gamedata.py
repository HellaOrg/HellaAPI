import os
import shutil
import subprocess

flatbuffer_list = [
    "activity_table",
    "audio_data",
    "battle_equip_table",
    "buff_table",
    "building_data",
    "campaign_table",
    "chapter_table",
    "char_master_table",
    "char_meta_table",
    "char_patch_table",
    "character_table",
    "charm_table",
    "charword_table",
    "checkin_table",
    "climb_tower_table",
    "clue_data",
    "crisis_table",
    "crisis_v2_table",
    "display_meta_table",
    "enemy_database",
    "enemy_handbook_table",
    "favor_table",
    "gacha_table",
    "gamedata_const",
    "handbook_info_table",
    "handbook_team_table",
    "hotupdate_meta_table",
    "item_table",
    "level_script_table",
    "medal_table",
    "meta_ui_table",
    "mission_table",
    "open_server_table",
    "replicate_table",
    "retro_table",
    "roguelike_topic_table",
    "sandbox_perm_table",
    "shop_client_table",
    "skill_table",
    "skin_table",
    "special_operator_table",
    "stage_table",
    "story_review_meta_table",
    "story_review_table",
    "story_table",
    "tip_table",
    "token_table",
    "uniequip_table",
    "zone_table",
    "cooperate_battle_table",
    "ep_breakbuff_table",
    "extra_battlelog_table",
    "legion_mode_buff_table",
    "building_local_data",
]

flatbuffer_mappings = {
    "level_": "prts___levels",
}

def get_flatbuffer_name(path: str) -> str | None:
    matched = [
        *[flatbuffer for flatbuffer in flatbuffer_list if flatbuffer == path],
        *[flatbuffer for mapping, flatbuffer in flatbuffer_mappings.items() if mapping in path],
    ]
    return matched[0] if matched else None

def main():
    anon_dir = "./extract/anon"
    obb_dir = "./extract/obb"
    merge_dir = "./merge"
    out_dir = "./out"

    files = {}
    for dir_path in [anon_dir, obb_dir]:
        for root, _, fnames in os.walk(dir_path):
            for fname in fnames:
                if not fname.endswith(".bytes"):
                    continue
                base = fname[:-6]  # strip ".bytes"
                core = None
                if get_flatbuffer_name(base):
                    core = base
                elif len(base) > 6 and get_flatbuffer_name(base[:-6]):
                    core = base[:-6]
                else:
                    print(f"Unknown FBS schema '{fname}'")
                    continue
                if core in files:
                    continue
                full_path = os.path.join(root, fname)
                dst_path = os.path.relpath(os.path.join(root, core + ".bytes"), dir_path)
                files[core] = (full_path, dst_path)

    for core, (src, dst_path) in files.items():
        dst = os.path.join(merge_dir, dst_path)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(src, "rb") as fsrc, open(dst, "wb") as fdst:
            fsrc.seek(128)  # trim first 128 bytes
            shutil.copyfileobj(fsrc, fdst)
            print(f"Trimmed & copied {src} -> {dst}")

    for root, _, fnames in os.walk(merge_dir):
        for fname in fnames:
            if not fname.endswith(".bytes"):
                continue

            base = fname[:-6]
            schema = get_flatbuffer_name(base)
            if not schema:
                print(f"Unknown schema for {fname}, skipping")
                continue

            src_path = os.path.join(root, fname)
            rel_path = os.path.relpath(src_path, merge_dir)
            out_subdir = os.path.join(out_dir, os.path.dirname(rel_path))
            os.makedirs(out_subdir, exist_ok=True)

            subprocess.run([
                "flatc",
                "-o", out_subdir,
                "--no-warnings",
                "--json",
                "--strict-json",
                "--natural-utf8",
                "--defaults-json",
                "--raw-binary",
                os.path.join("..", "ArknightsFlatbuffers", "yostar", f"{schema}.fbs"),
                "--",
                src_path
            ])
            print(f"Converted {src_path} -> {out_subdir}")

if __name__ == "__main__":
    main()
