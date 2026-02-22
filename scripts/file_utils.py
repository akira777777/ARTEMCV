import pathlib
from typing import Union

def read_file(path: Union[str, pathlib.Path]) -> str:
    """Reads the content of a file.

    Args:
        path: The path to the file.

    Returns:
        The content of the file.

    Raises:
        FileNotFoundError: If the file does not exist.
        IOError: If there is an error reading the file.
    """
    p = pathlib.Path(path)
    try:
        return p.read_text(encoding='utf-8')
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {path}")
    except Exception as e:
        raise IOError(f"Error reading file {path}: {e}")

def write_file(path: Union[str, pathlib.Path], content: str) -> None:
    """Writes content to a file.

    Args:
        path: The path to the file.
        content: The content to write.

    Raises:
        IOError: If there is an error writing to the file.
    """
    p = pathlib.Path(path)
    try:
        # Ensure the parent directory exists
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding='utf-8')
    except Exception as e:
        raise IOError(f"Error writing to file {path}: {e}")
