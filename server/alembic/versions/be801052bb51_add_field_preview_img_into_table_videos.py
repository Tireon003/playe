"""add field 'preview_img' into table 'videos'

Revision ID: be801052bb51
Revises: b4af338373c9
Create Date: 2024-12-18 23:59:28.389560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'be801052bb51'
down_revision: Union[str, None] = 'b4af338373c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('videos', sa.Column('preview_img', sa.LargeBinary(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('videos', 'preview_img')
    # ### end Alembic commands ###